import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  pbkdf2Sync,
} from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const SALT_LENGTH = 64; // Using a 64-byte salt
const KEY_LENGTH = 32; // aes-256 requires a 32-byte key
const PBKDF2_ITERATIONS = 100000; // A good number of iterations

export function encrypt(text: string, encryptionKey: Buffer): string {
  const salt = randomBytes(SALT_LENGTH);
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, encryptionKey, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  // Combine salt, IV, auth tag, and encrypted data
  return [
    salt.toString("hex"),
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted,
  ].join(":");
}

export function decrypt(encryptedData: string, encryptionKey: Buffer): string {
  const parts = encryptedData.split(":");
  if (parts.length !== 4) {
    throw new Error("Invalid encrypted data format");
  }

  const [saltHex, ivHex, authTagHex, encrypted] = parts;

  const salt = Buffer.from(saltHex, "hex");
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = createDecipheriv(ALGORITHM, encryptionKey, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

export function deriveKey(masterPassword: string, salt: Buffer): Buffer {
  return pbkdf2Sync(masterPassword, salt, PBKDF2_ITERATIONS, KEY_LENGTH, "sha512");
}
