export type JwtPayload = {
  USER_CLP: string;
  Role_CLP: number;
  RoleName: string | null;
  exp: number;
};