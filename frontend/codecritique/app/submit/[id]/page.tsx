"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@clerk/nextjs"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "lucide-react"
import  type {Submission, Tag, ReviewCriteria,ReviewRating, Review} from "@/app/types"

export default function SubmissionByIdPage(){
    const { getToken, isSignedIn, isLoaded} = useAuth();
    const params = useParams();
    const router = useRouter();

    const submissionId = params.id as string;

    const [submission, setSubmission]= useState<Submission | null>(null);
    const [criteria, setCriteria]= useState<ReviewCriteria | []>([]);
    const [Review, setReview]= useState<Review | []>([]);
    
}
