export interface RepoRequest {
  name: string;
  default_branch: string;
  description: string;
}
export interface RepoResponse {
  id: number;  
  name: string
  link: string;
  description: string;
  created: string;
}
