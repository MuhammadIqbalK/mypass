"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";

// Define the schema for validation
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      toast.success("Account created successfully");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    // Validate the input before sending
    const formData = {
      email: email.trim(),
      password: password.trim()
    };
    
    try {
      registerSchema.parse(formData);
      // Explicitly pass the formData object to the mutate function
      registerMutation.mutate({
        email: formData.email,
        password: formData.password
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(`Validation error: ${error.issues[0].message}`);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value.replace(/\s/g, ""))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="password">Master Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        <p className="text-sm text-muted-foreground mt-1">
          Must be at least 8 characters long
        </p>
      </div>
      
      <div>
        <Label htmlFor="confirmPassword">Confirm Master Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={registerMutation.isPending}
        className="w-full"
      >
        {registerMutation.isPending ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}