"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-neutral-950">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? "Login" : "Create Account"}</CardTitle>
          <CardDescription>
            {isLogin 
              ? "Enter your credentials to access your password manager" 
              : "Create a new account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLogin ? <LoginForm /> : <RegisterForm />}
          
          <div className="mt-4 text-center text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto font-medium"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}