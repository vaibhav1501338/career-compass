
import AuthLayout from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | Career Compass",
    description: "Log in to your Career Compass account.",
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <Card className="border-0 shadow-none lg:border lg:shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
