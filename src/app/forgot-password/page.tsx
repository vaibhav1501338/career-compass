
import AuthLayout from "@/components/auth/auth-layout";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Forgot Password | Career Compass",
    description: "Reset your Career Compass account password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <Card className="border-0 shadow-none lg:border lg:shadow-sm">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Forgot Your Password?
          </CardTitle>
          <CardDescription>
            No problem. Enter your email below and we'll send you a link to reset it.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </AuthLayout>
  );
}
