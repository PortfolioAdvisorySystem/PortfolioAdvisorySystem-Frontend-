export class Auth {}

export interface LoginRequest {
  email:    string;
  password: string;
}
 
export interface RegisterRequest {
  firstName:    string;
  lastName:     string;
  email:        string;
  password:     string;
  subscriberId?: number;
  role?:        string;
}
 
export interface AuthResponse {
  accessToken:  string;
  refreshToken: string;
  tokenType:    string;
  expiresIn:    number;
  userId:       number;
  email:        string;
  firstName:    string;
  role:         string;
  subscriberId: number | null;
}