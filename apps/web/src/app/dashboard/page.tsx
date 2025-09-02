"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react"; // Import useEffect
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PasswordList } from "@/components/password/password-list";
import { PasswordGenerator } from "@/components/password/password-generator";
import { CategoryChart } from "@/components/dashboard/category-chart";
import { StrengthChart } from "@/components/dashboard/strength-chart";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const router = useRouter();
  const { data: passwords, error, isLoading } = trpc.passwords.getAll.useQuery();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (error?.data?.code === "UNAUTHORIZED") {
      router.push("/login");
    }
  }, [error, router]); // Add error and router to dependency array

  // If unauthorized, return null immediately to prevent rendering the rest of the component
  if (error?.data?.code === "UNAUTHORIZED") {
    return null;
  }

  const safePasswords = passwords || [];

  return (
    <div className="min-h-screen py-4 m-10 mt-1">
      <div className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">MyPass Dashboard</h1>
          
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>Your password manager stats</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Passwords:</span>
                    <span className="font-bold">{safePasswords.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Categories:</span>
                    <span className="font-bold">
                      {[...new Set(safePasswords.map(p => p.category).filter(Boolean))].length}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Password Generator</CardTitle>
              <CardDescription>Create a secure password</CardDescription>
            </CardHeader>
            <CardContent>
              <PasswordGenerator />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
              <CardDescription>Passwords per category</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-[300px] w-full" /> : <CategoryChart passwords={safePasswords} />}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Password Strength</CardTitle>
              <CardDescription>Distribution of password strengths</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? <Skeleton className="h-[300px] w-full" /> : <StrengthChart passwords={safePasswords} />}
            </CardContent>
          </Card>
        </div>

        <PasswordList />
      </div>
    </div>
  );
}
