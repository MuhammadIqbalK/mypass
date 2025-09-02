"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function PasswordForm({ 
  onSuccess, 
  initialData 
}: { 
  onSuccess: () => void;
  initialData?: {
    id: number;
    website: string;
    username: string;
    password: string;
    category?: string;
  };
}) {
  const isEditing = !!initialData;
  
  const [website, setWebsite] = useState(initialData?.website || "");
  const [username, setUsername] = useState(initialData?.username || "");
  const [password, setPassword] = useState(initialData?.password || "");
  const [category, setCategory] = useState(initialData?.category || "");
  
  const createMutation = trpc.passwords.create.useMutation({
    onSuccess: () => {
      toast.success("Password saved successfully");
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
  
  const updateMutation = trpc.passwords.update.useMutation({
    onSuccess: () => {
      toast.success("Password updated successfully");
      onSuccess();
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing) {
      updateMutation.mutate({
        id: initialData.id,
        website,
        username,
        password,
        category: category || undefined,
      });
    } else {
      createMutation.mutate({
        website,
        username,
        password,
        category: category || undefined,
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="password">Password</Label>
        <div className="flex gap-2">
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              // Generate a random password
              const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
              let result = "";
              for (let i = 0; i < 16; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
              }
              setPassword(result);
            }}
          >
            Generate
          </Button>
        </div>
      </div>
      
      <div>
        <Label htmlFor="category">Category (optional)</Label>
        <Input
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>
      
      
      
      <Button 
        type="submit" 
        disabled={createMutation.isPending || updateMutation.isPending}
        className="w-full"
      >
        {createMutation.isPending || updateMutation.isPending
          ? "Saving..."
          : isEditing
          ? "Update Password"
          : "Save Password"}
      </Button>
    </form>
  );
}