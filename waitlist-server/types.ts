export interface JoinRequest {
  name?: string;
  email: string;
}

export interface WaitlistUser {
  id?: number;
  name: string | null;
  email: string;
  is_verified: boolean;
  verification_code: string;
  verified_at?: string | null;
}
