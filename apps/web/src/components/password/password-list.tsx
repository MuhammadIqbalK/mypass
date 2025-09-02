"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { PasswordForm } from "./password-form";
import { Copy } from "lucide-react";
import { useRouter } from "next/navigation"; // Move this to the top

// Define the type for a single password item
type PasswordItem = {
  id: number;
  userId: number;
  website: string;
  username: string;
  encryptedPassword: string;
  category: string | null;
  strength: 1 | 2 | 3 | 4 | 5 | null;
  createdAt: string;
  updatedAt: string;
};

export function PasswordList() {
  const router = useRouter(); // Move useRouter to the top level
  const [editPasswordId, setEditPasswordId] = useState<number | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [decryptedPasswordForEdit, setDecryptedPasswordForEdit] = useState<string | null>(null);
  const [decryptedPasswordForShow, setDecryptedPasswordForShow] = useState<string | null>(null); // New state for show password
  const [passwordToDelete, setPasswordToDelete] = useState<{id: number, website: string} | null>(null);
  const [isMasterPasswordModalOpen, setIsMasterPasswordModalOpen] = useState(false);
  const [currentPasswordToEdit, setCurrentPasswordToEdit] = useState<PasswordItem | null>(null);
  const [showPasswordData, setShowPasswordData] = useState<{ encryptedPassword: string; website: string } | null>(null);

  const { data: passwords, refetch } = trpc.passwords.getAll.useQuery();
  const decryptMutation = trpc.passwords.decrypt.useMutation();
  
  const deleteMutation = trpc.passwords.delete.useMutation({
    onSuccess: () => {
      toast.success("Password deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleDeleteClick = (password: {id: number, website: string}) => {
    setPasswordToDelete(password);
  };

  const confirmDelete = () => {
    if (passwordToDelete) {
      deleteMutation.mutate({ id: passwordToDelete.id });
      setPasswordToDelete(null);
    }
  };

  const handleRefresh = () => {
    refetch();
    router.refresh(); // Trigger a refresh to re-evaluate server components
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Saved Passwords</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>Add Password</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Password</DialogTitle>
            </DialogHeader>
            <PasswordForm 
              onSuccess={() => {
                handleRefresh();
                setIsAddOpen(false); // Close the dialog after successful creation
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>
      
      
      {passwords?.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No passwords saved</CardTitle>
            <CardDescription>
              Add your first password to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsAddOpen(true)}>Add Password</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {passwords?.map((password) => (
            <Card key={password.id}>
              <CardHeader>
                <CardTitle>{password.website}</CardTitle>
                <CardDescription>{password.username}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      setShowPasswordData({ encryptedPassword: password.encryptedPassword, website: password.website });
                      setDecryptedPasswordForShow(null); // Reset decrypted password
                    }}
                    disabled={decryptMutation.isPending && decryptMutation.variables?.encryptedPassword === password.encryptedPassword}
                  >
                    {decryptMutation.isPending && decryptMutation.variables?.encryptedPassword === password.encryptedPassword
                      ? "Decrypting..."
                      : "Show Password"}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setCurrentPasswordToEdit(password);
                      setDecryptedPasswordForEdit(null); // Reset decrypted password
                      setIsMasterPasswordModalOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDeleteClick(password)}
                    disabled={deleteMutation.isPending && deleteMutation.variables?.id === password.id}
                  >
                    {deleteMutation.isPending && deleteMutation.variables?.id === password.id
                      ? "Deleting..."
                      : "Delete"}
                  </Button>
                </div>
                {password.category && (
                  <div className="text-sm text-muted-foreground">
                    Category: {password.category}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Master Password Dialog for Edit */}
      <Dialog open={isMasterPasswordModalOpen} onOpenChange={setIsMasterPasswordModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter user password as Master Password</DialogTitle>
            <DialogDescription>
              Please enter your user password as master password to decrypt and edit this entry.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const inputMasterPassword = formData.get("masterPassword") as string;

            if (!inputMasterPassword) {
              toast.error("Master password cannot be empty.");
              return;
            }

            if (!currentPasswordToEdit) {
              toast.error("No password selected for editing.");
              setIsMasterPasswordModalOpen(false);
              return;
            }

            try {
              const result = await decryptMutation.mutateAsync({
                encryptedPassword: currentPasswordToEdit.encryptedPassword,
              });
              setDecryptedPasswordForEdit(result.decryptedPassword);
              setEditPasswordId(currentPasswordToEdit.id);
              setIsMasterPasswordModalOpen(false); // Close this modal
            } catch (error) {
              toast.error("Failed to decrypt password. Check your master password.");
            }
          }} className="space-y-4">
            <div>
              <Label htmlFor="masterPassword">Master Password</Label>
              <Input
                id="masterPassword"
                name="masterPassword"
                type="password"
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={decryptMutation.isPending}>
                {decryptMutation.isPending ? "Decrypting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Show Password Dialog */}
      <Dialog open={showPasswordData !== null && decryptedPasswordForShow === null} onOpenChange={(open) => {
        if (!open) {
          setShowPasswordData(null);
          setDecryptedPasswordForShow(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Show Password for {showPasswordData?.website}</DialogTitle>
            <DialogDescription>
              Please enter your user password as master password to view this entry.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            const inputMasterPassword = formData.get("masterPassword") as string;

            if (!inputMasterPassword) {
              toast.error("Master password cannot be empty.");
              return;
            }

            if (!showPasswordData) {
              toast.error("No password selected for viewing.");
              setShowPasswordData(null);
              return;
            }

            try {
              const result = await decryptMutation.mutateAsync({
                encryptedPassword: showPasswordData.encryptedPassword,
              });
              setDecryptedPasswordForShow(result.decryptedPassword);
              form.reset(); // Reset the form to clear master password input
            } catch (error) {
              toast.error("Failed to decrypt password. Check your master password.");
            }
          }} className="space-y-4">
            <div>
              <Label htmlFor="masterPassword">Master Password</Label>
              <Input
                id="masterPassword"
                name="masterPassword"
                type="password"
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={decryptMutation.isPending}>
                {decryptMutation.isPending ? "Decrypting..." : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Show Decrypted Password Dialog */}
      <Dialog open={decryptedPasswordForShow !== null} onOpenChange={(open) => {
        if (!open) {
          setDecryptedPasswordForShow(null);
          setShowPasswordData(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decrypted Password for {showPasswordData?.website}</DialogTitle>
          </DialogHeader>
          {decryptedPasswordForShow && (
            <div className="py-4 text-center text-lg font-mono bg-muted rounded-md relative group">
              {decryptedPasswordForShow}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  navigator.clipboard.writeText(decryptedPasswordForShow);
                  toast.success("Password copied to clipboard");
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog 
        open={editPasswordId !== null} 
        onOpenChange={(open) => {
          if (!open) {
            setEditPasswordId(null);
            setDecryptedPasswordForEdit(null);
            setCurrentPasswordToEdit(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Password</DialogTitle>
          </DialogHeader>
          {editPasswordId !== null && decryptedPasswordForEdit !== null && (
            <PasswordForm 
              initialData={{
                ...(passwords?.find(p => p.id === editPasswordId) || {}),
                id: editPasswordId as number,
                website: (passwords?.find(p => p.id === editPasswordId)?.website ?? '') as string,
                username: (passwords?.find(p => p.id === editPasswordId)?.username ?? '') as string,
                category: (passwords?.find(p => p.id === editPasswordId)?.category ?? undefined) as string | undefined,
                password: decryptedPasswordForEdit,
              }}
              onSuccess={() => {
                refetch();
                setEditPasswordId(null);
                setDecryptedPasswordForEdit(null);
                setCurrentPasswordToEdit(null);
                handleRefresh();
              }} 
            />
          )}
          {editPasswordId !== null && decryptedPasswordForEdit === null && (
            <p className="text-center text-muted-foreground">
              Enter your master password to decrypt and edit this password.
            </p>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={passwordToDelete !== null} onOpenChange={(open) => !open && setPasswordToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the password for <strong>{passwordToDelete?.website}</strong>.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPasswordToDelete(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
