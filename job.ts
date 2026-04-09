// src/types/job.ts

export interface Job {
  id?: string;
  jobTitle: string;
  department: string;
  level: string;
  description: string;
  requirements: string;
  employmentType: string;
  salaryRange: string;
  status: string;
  datePosted: string;
}

export interface Application {
  id?: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedDate: string;
  status: string;
}