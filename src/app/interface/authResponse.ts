import { User } from './user';

export interface AuthResponse {
  status: string;
  message: string | null;
  data: {
    user: User;
    token: string;
  };
}
