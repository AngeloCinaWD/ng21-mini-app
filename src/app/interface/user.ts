export interface UserPreference {
  id: number;
  user_id: number;
  language: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  preference?: UserPreference | null;
  created_at: string;
  updated_at: string;
}
