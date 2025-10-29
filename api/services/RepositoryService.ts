import {APIRequestContext, APIResponse, expect, Request} from '@playwright/test'
import { TestUserCreate, TestUserResponse } from '../DTO/user.dto';

export default class RepositoryService {
        private request: APIRequestContext
        private token?: string

        constructor(request: APIRequestContext, token?: string) {
            this.request = request
            this.token = token
        }
          setToken(token: string) {
            this.token = token
        }

        private get headers() {
            return {
                'Authorization': `token ${this.token}`,
                'Content-Type': 'application/json'
            }
        }

        async getAllUserRepositories() {
            const response = await this.request.get(`/api/v1/user/repos`, {
                headers: this.headers
            })
            expect(response.status()).toBe(200);
            return await response.json()
        }

        async getAllUsersAsAdmin() {
            const response = await this.request.get(`/api/v1/admin/users`, {
                headers: this.headers
            })
            if (!response.ok) {
                console.log("Can not get users, check your admin token")
            }
            return response  
        }
        async createUser(userData: TestUserCreate): Promise<APIResponse> {
            return this.request.post('/api/v1/admin/users/', {
                headers: this.headers,
                data: userData 
            });
        }
        
}