
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { tuneResume } from "@/ai/flows/resume-ai-tuning";
import { correctResumeFormat } from "@/ai/flows/correct-resume-format";
import { Upload, Loader2, FileText, CheckCircle, WandSparkles } from "lucide-react";

export default function ResumePage() {
  const [file, setFile] = useState<File | null>(null);
  const [feedback, setFeedback] = useState<string>("");
  const [isFixable, setIsFixable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [correcting, setCorrecting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
       if (selectedFile.size > 4 * 1024 * 1024) { // 4MB limit for Gemini
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload a file smaller than 4MB.",
        });
        return;
      }
      setFile(selectedFile);
      setFeedback("");
      setIsFixable(false);
    }
  };

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleGetFeedback = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "No file selected",
        description: "Please upload your resume to get feedback.",
      });
      return;
    }

    setLoading(true);
    setFeedback("");
    setIsFixable(false);

    try {
      const resumeDataUri = await fileToDataUri(file);
      const result = await tuneResume({ resumeDataUri });

      if (result.feedback) {
        setFeedback(result.feedback);
        setIsFixable(result.isFixable);
      } else {
        throw new Error("AI did not provide any feedback.");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get resume feedback. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCorrectFormat = async () => {
    if (!file) return;
    setCorrecting(true);
    try {
        const resumeDataUri = await fileToDataUri(file);
        const result = await correctResumeFormat({ resumeDataUri });
        if (result.correctedContent) {
            setFeedback(result.correctedContent);
            setIsFixable(false); // Hide the button after correction
            toast({
                title: "Resume Corrected",
                description: "The AI has reformatted your resume content below.",
            });
        } else {
            throw new Error("AI could not correct the resume.");
        }
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Correction Failed",
            description: "Failed to correct the resume format. Please try again.",
        });
    } finally {
        setCorrecting(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
          Resume Support
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Get AI-powered feedback to make your resume stand out.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Upload Your Resume</CardTitle>
          <CardDescription>
            Upload your resume (PDF, DOCX) to get instant feedback. Max file size: 4MB.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="resume-file">Resume File</Label>
            <div className="flex gap-4">
                <Input
                    id="resume-file"
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                />
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Choose File
                </Button>
                {file && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>{file.name}</span>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                )}
            </div>

          </div>
          <Button onClick={handleGetFeedback} disabled={loading || correcting || !file}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Get Feedback"
            )}
          </Button>
        </CardContent>
      </Card>
      
      {feedback && (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <CardTitle className="font-headline">AI Feedback</CardTitle>
                {isFixable && !loading && (
                    <Button onClick={handleCorrectFormat} disabled={correcting} size="sm" variant="outline">
                        {correcting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Correcting...
                            </>
                        ) : (
                            <>
                                <WandSparkles className="mr-2 h-4 w-4" />
                                Correct Format with AI
                            </>
                        )}
                    </Button>
                )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground dark:prose-invert prose-headings:font-headline">
                <div dangerouslySetInnerHTML={{ __html: feedback.replace(/\n/g, '<br />') }} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
