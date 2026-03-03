export type Talent = {
  id: number;
  fullName: string;
  email: string;
  role?: string;
};
export type CreateTalent = Omit<Talent, "id">;