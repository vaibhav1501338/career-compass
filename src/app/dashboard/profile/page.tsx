
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import type { UserProfile } from "@/lib/types";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  stream: z.string().optional(),
  interests: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      stream: "",
      interests: "",
    },
  });

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        setFetching(true);
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserProfile;
          form.reset({
            name: userData.name || "",
            stream: userData.stream || "",
            interests: (userData.interests || []).join(", "),
          });
        }
        setFetching(false);
      };
      fetchUserData();
    }
  }, [user, form]);

  async function onSubmit(values: ProfileFormValues) {
    if (!user) {
      toast({ variant: "destructive", title: "You must be logged in." });
      return;
    }
    setLoading(true);
    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        {
          name: values.name,
          stream: values.stream || "",
          interests: values.interests
            ? values.interests.split(",").map((i) => i.trim()).filter(Boolean)
            : [],
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      toast({
        title: "Profile Updated",
        description: "Your information has been saved.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save your profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
        <div className="flex items-center justify-center pt-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
          Your Profile
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Manage your personal information to get better recommendations.
        </p>
      </div>
      <Card>
        <CardHeader>
            <CardTitle className="font-headline">Personal Information</CardTitle>
            <CardDescription>Update your name and career details.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="stream"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field of Study / Career Stream</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Computer Science, Marketing" {...field} />
                    </FormControl>
                    <FormDescription>
                        Your primary area of study or professional work.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="interests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interests & Skills</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Web Development, Graphic Design" {...field} />
                    </FormControl>
                     <FormDescription>
                        A comma-separated list of your skills and interests.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Saving...</> : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
