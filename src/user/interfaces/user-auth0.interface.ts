export interface UserAuth0Interface {
  sub: string;
  given_name?: string;
  family_name?: string;
  nickname: string;
  name: string;
  picture: string;
  locale?: string;
  updated_at: Date;
  email: string;
  email_verified: boolean;
}
