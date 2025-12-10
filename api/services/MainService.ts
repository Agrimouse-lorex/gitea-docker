import {APIRequestContext, APIResponse, expect} from '@playwright/test'
import { TestUserCreate, TestUserResponse } from '../DTO/user.dto';
import { RepoRequest } from '../DTO/repo.dto';
import fs from 'fs';
import path from 'path/win32';

export default class MainService {
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
        async blockLastUser() {
            const getUser = await this.request.get('/api/v1/admin/users', {
                headers: this.headers
            })
            expect(getUser.status()).toBe(200)
            const body = await getUser.json()
            const users = await body.sort((a: { id: number; }, b: { id: number; }) => b.id - a.id); // Sorts in descending order of ID
            const lastUser = users[0];
            const username = await lastUser.login
            console.log("Blocked User: ", username)
            const response = await this.request.put(`/api/v1/user/blocks/${username}`,{
                headers: this.headers,
                data: {
                        "username": `${username}`
                    }
            })
            return response
        }
        async unblockLastUser() {
                        const getUser = await this.request.get('/api/v1/admin/users', {
                headers: this.headers
            })
            expect(getUser.status()).toBe(200)
            const body = await getUser.json()
            const users = await body.sort((a: { id: number; }, b: { id: number; }) => b.id - a.id); // Sorts in descending order of ID
            const lastUser = users[0];
            const username = await lastUser.login
            const response = await this.request.delete(`/api/v1/user/blocks/${username}`,{
                headers: this.headers,
                data: {
                        "username": `${username}`
                    }
            })
            return response
        }
        async blockCertainUser(username: string) {
                const response = await this.request.put(`/api/v1/user/blocks/${username}`,{
                headers: this.headers,
                data: {
                        "username": `${username}`
                    }
            })
            return response
        }
        async unblockCertainUser(username: string) {
                const response = await this.request.delete(`/api/v1/user/blocks/${username}`,{
                headers: this.headers,
                data: {
                        "username": `${username}`
                    }
            })
            return response
        }
        async blockUserCheck(username: string) {
            const response = await this.request.get(`/api/v1/user/blocks/${username}`,{
                headers: this.headers,
            })
            return response
        }
        async blockedUsersList() { 
            const response = await this.request.get('/api/v1/user/blocks',{
                headers: this.headers
            })
            return response
        }
        async avatarPost() {
            const filePath = path.resolve(process.cwd(), 'images/Jeff.jpg');
            const base64img = fs.readFileSync(filePath, {encoding: 'base64'})
            const response = await this.request.post('/api/v1/user/avatar', {
                headers: this.headers,
                data: {
                    image: base64img
                }
            })
            return response
        }
        async avatarDelete() {
            return this.request.delete('/api/v1/user/avatar', {
                headers: this.headers
            })
        }
        async getRepoList() {
            const response = await this.request.get('/api/v1/user/repos', {
                headers: this.headers
            })
            expect(response.status()).toBe(200);
            return response.json()
        }
        async createRepo(repo: RepoRequest) {
            return this.request.post('/api/v1/user/repos', {
                headers: this.headers,
                data: repo
            })
        }
        async getUserData() {
            const res = await this.request.get(`/api/v1/user`, {
                headers: this.headers
            })
            const body = await res.json()
            const user: TestUserResponse = {
                id: body.id,
                email: body.email,
                username: body.login ?? body.username,
                created: body.created,
            }
            return user
        }
}