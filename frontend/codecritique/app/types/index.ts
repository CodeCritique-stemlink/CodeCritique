export type Tag = {
  id: number;
  name: string;
};

export type Submission = {
  id: number;
  title: string;
  description: string;
  githubUrl: string;
  status: string;
  tags: Tag[];
  user?: {
    id: number;
    firstName?: string;
    lastName?: string;
    userName?: string;
    karmaPoints?: number;
    profileImageUrl?: string;
  };
};

export type ReviewCriteria = {
  id: number;
  name: string;
  submissionId: number;
};

export type ReviewRating = {
  id: number;
  criteriaId: number;
  score: number;
    criteria: {
      id: number;
      name:string;
    }
  
};

export type Review = {
  id: number;
  strengths: string;
  improvements: string;
  resources?: string;
  ratings: ReviewRating[];
  reviewer?: {
    id: number;
    firstName?: string;
    lastName?: string;
    userName?: string;
    karmaPoints?: number;
    profileImageUrl?: string;
  };
};