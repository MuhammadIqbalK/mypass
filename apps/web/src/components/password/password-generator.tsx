"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [generatedPassword, setGeneratedPassword] = useState("");
  
  const generateMutation = trpc.generator.generate.useMutation({
    onSuccess: (data) => {
      setGeneratedPassword(data.password);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
  
  const handleGenerate = () => {
    generateMutation.mutate({ length });
  };
  
  const copyToClipboard = () => {
    if (!generatedPassword) return;
    
    navigator.clipboard.writeText(generatedPassword);
    toast.success("Password copied to clipboard");
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label className="mb-1">Length: {length}</Label>
        <Slider
          min={8}
          max={128}
          step={1}
          value={[length]}
          onValueChange={([value]) => setLength(value)}
        />
      </div>
      
      <div className="flex gap-2">
        <Input
          value={generatedPassword}
          readOnly
          placeholder="Click generate to create a password"
        />
        <Button 
          onClick={copyToClipboard}
          disabled={!generatedPassword}
        >
          Copy
        </Button>
      </div>
      
      <Button 
        onClick={handleGenerate}
        disabled={generateMutation.isPending}
        className="w-full"
      >
        {generateMutation.isPending ? "Generating..." : "Generate Password"}
      </Button>
    </div>
  );
}