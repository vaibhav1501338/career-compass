
"use client";

import { useState } from "react";
import { useApplications } from "@/hooks/use-applications";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Loader2, Edit, Trash2, ExternalLink } from "lucide-react";
import { ApplicationForm } from "@/components/dashboard/application-form";
import type { JobApplication, ApplicationStatus } from "@/lib/types";
import { formatDistanceToNow, format } from "date-fns";
import { Timestamp } from "firebase/firestore";

const STATUS_CONFIG: Record<ApplicationStatus, { title: string; color: string }> = {
    Wishlist: { title: "Wishlist", color: "bg-gray-500" },
    Applied: { title: "Applied", color: "bg-blue-500" },
    Interviewing: { title: "Interviewing", color: "bg-yellow-500" },
    Offer: { title: "Offer", color: "bg-green-500" },
    Rejected: { title: "Rejected", color: "bg-red-500" },
};

const STATUS_ORDER: ApplicationStatus[] = ["Wishlist", "Applied", "Interviewing", "Offer", "Rejected"];

export default function TrackerPage() {
    const { applications, loading, addApplication, updateApplication, deleteApplication } = useApplications();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingApplication, setEditingApplication] = useState<JobApplication | null>(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { toast } = useToast();

    const handleFormSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            if (editingApplication) {
                await updateApplication(editingApplication.id!, data);
                toast({ title: "Application Updated" });
            } else {
                await addApplication(data);
                toast({ title: "Application Added" });
            }
            setIsFormOpen(false);
            setEditingApplication(null);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to save the application. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const openDeleteAlert = (id: string) => {
        setDeletingId(id);
        setIsAlertOpen(true);
    };

    const handleDelete = async () => {
        if (!deletingId) return;
        try {
            await deleteApplication(deletingId);
            toast({ title: "Application Deleted" });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete application.",
            });
        } finally {
            setIsAlertOpen(false);
            setDeletingId(null);
        }
    };

    const applicationsByStatus = STATUS_ORDER.reduce((acc, status) => {
        acc[status] = applications.filter(app => app.status === status);
        return acc;
    }, {} as Record<ApplicationStatus, JobApplication[]>);

    return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
            <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
            Application Tracker
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
            Organize and manage your job applications in one place.
            </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setEditingApplication(null)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Application
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="font-headline">{editingApplication ? "Edit" : "Add New"} Application</DialogTitle>
                    <DialogDescription>
                        Fill in the details of the job application below.
                    </DialogDescription>
                </DialogHeader>
                <ApplicationForm
                    application={editingApplication}
                    onSubmit={handleFormSubmit}
                    onCancel={() => { setIsFormOpen(false); setEditingApplication(null); }}
                    isSubmitting={isSubmitting}
                />
            </DialogContent>
        </Dialog>
      </div>

      {loading ? (
         <div className="flex items-center justify-center pt-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 items-start">
            {STATUS_ORDER.map(status => (
                <div key={status} className="space-y-4 rounded-lg bg-card/50 p-4">
                    <div className="flex items-center gap-2">
                         <div className={cn("h-2 w-2 rounded-full", STATUS_CONFIG[status].color)}></div>
                        <h2 className="font-headline text-lg font-semibold">{STATUS_CONFIG[status].title}</h2>
                        <span className="text-sm font-medium text-muted-foreground">{applicationsByStatus[status].length}</span>
                    </div>
                    <div className="space-y-4">
                        {applicationsByStatus[status].map(app => (
                            <Card key={app.id} className="group/card transition-shadow duration-300 hover:shadow-lg">
                                <CardHeader>
                                    <CardTitle className="font-headline text-base">{app.jobTitle}</CardTitle>
                                    <CardDescription>{app.companyName}</CardDescription>
                                </CardHeader>
                                {app.notes && (
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground line-clamp-2">{app.notes}</p>
                                    </CardContent>
                                )}
                                <CardFooter className="flex-col items-start gap-2 text-xs text-muted-foreground">
                                   {app.dateApplied && (
                                       <div>Applied: {format((app.dateApplied as Timestamp).toDate(), 'MMM d, yyyy')}</div>
                                   )}
                                   <div>
                                     Last updated {formatDistanceToNow((app.updatedAt as Timestamp).toDate(), { addSuffix: true })}
                                   </div>
                                    <div className="mt-2 flex w-full items-center justify-between">
                                        <div>
                                        {app.url && (
                                            <a href={app.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary transition-colors">
                                                <ExternalLink className="h-3 w-3" /> Job Link
                                            </a>
                                        )}
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => {setEditingApplication(app); setIsFormOpen(true)}}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openDeleteAlert(app.id!)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardFooter>
                            </Card>
                        ))}
                         {applicationsByStatus[status].length === 0 && (
                            <div className="text-center text-sm text-muted-foreground py-8">No applications</div>
                         )}
                    </div>
                </div>
            ))}
        </div>
      )}

        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this application from your tracker.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}
