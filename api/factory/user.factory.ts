import { TestUserCreate } from "../DTO/user.dto";

export class UserFactory {
  static create(
    username?: string,
    email?: string,
    password: string = 'Test123!'
  ): TestUserCreate {
    const randomPref = Date.now();

    return {
      username: username ?? `QA_Auto_User${randomPref}`,
      email: email ?? `olektrom+${randomPref}@qamadness.com`,
      password
    };
  }
}