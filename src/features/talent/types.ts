export type EnglishLevel =
  | 'A1 - Beginner'
  | 'A2 - Elementary'
  | 'B1 - Intermediate'
  | 'B2 - Upper Intermediate'
  | 'C1 - Advanced'
  | 'C2 - Proficient';

export type WorkScheme = 'Remote' | 'Hybrid' | 'On-site' | 'Flexible';

export type VisaStatus = 'Yes' | 'No' | 'In Progress';

export type PrimaryRole =
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'Fullstack Developer'
  | 'Fullstack Engineer'
  | 'UI/UX Designer'
  | 'Project Manager'
  | 'QA Analyst';

export interface Talent {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  primaryRole: PrimaryRole;
  techStack: string;         // comma-separated
  yearsOfExperience: number;
  modules: string;
  englishLevel: EnglishLevel;
  linkedinUrl: string;
  cvFileName?: string;
  salaryExpectation: string;
  hourlyRate?: string;
  workScheme: WorkScheme;
  visaStatus: VisaStatus;
  isBlacklisted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type TalentFormData = Omit<Talent, 'id' | 'createdAt' | 'updatedAt'>;