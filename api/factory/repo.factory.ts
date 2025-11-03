import { RepoRequest } from "../DTO/repo.dto";

export class RepoFactory {
  static create(
    name?: string,
    branch: string = 'main',
    description: string = 'Test123!'
  ): RepoRequest {
    const randomPref = Date.now();

    return {
      name: name ?? `Repo_${randomPref}`,
      default_branch: branch,
      description: description
    };
  }
}