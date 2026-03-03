export type BackendUser = {
  USER_CLP: string;
  Role_CLP: number;        // O string si en DB viene string (aquí parece number)
  RoleName: string | null;
};

export type LoginRequest = {
  USER_CLP: string;
  PASS_CLP: string;
};

export type LoginResponse = {
  ok: boolean;
  token: string;
  user: BackendUser;
  error?: string;
};