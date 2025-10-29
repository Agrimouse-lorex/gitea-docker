export interface TestUserCreate {
  email: string;
  username: string;
  password: string;
}
export interface TestUserResponse {
    id: number
    email: string;
    username: string;
    created: string;
}