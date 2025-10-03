
import AuthLayout from "@/components/auth/auth-layout";
import { SignupForm } from "@/components/auth/signup-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up | Career Compass",
    description: "Create your Career Compass account.",
};

export default function SignupPage() {
  return (
    <AuthLayout>
      <Card className="border-0 shadow-none lg:border lg:shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Create an Account
          </CardTitle>
          <CardDescription>
            Start your journey with Career Compass today.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
