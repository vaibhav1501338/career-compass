
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy
} from "firebase/firestore";
import { useAuth } from "@/providers/auth-provider";
import type { JobApplication, ApplicationStatus } from "@/lib/types";

export function useApplications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
        setApplications([]);
        setLoading(false);
        return;
    }

    setLoading(true);
    const q = query(
        collection(db, "applications"), 
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const apps: JobApplication[] = [];
      querySnapshot.forEach((doc) => {
        apps.push({ id: doc.id, ...doc.data() } as JobApplication);
      });
      setApplications(apps);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addApplication = async (app: Omit<JobApplication, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error("User not authenticated");
    await addDoc(collection(db, "applications"), {
      ...app,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const updateApplication = async (id: string, updates: Partial<JobApplication>) => {
    const docRef = doc(db, "applications", id);
    await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
    });
  };

  const deleteApplication = async (id: string) => {
    const docRef = doc(db, "applications", id);
    await deleteDoc(docRef);
  };

  return { applications, loading, addApplication, updateApplication, deleteApplication };
}
