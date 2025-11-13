import {APIRequestContext, APIResponse, expect} from '@playwright/test'
import { TestUserCreate, TestUserResponse } from '../DTO/user.dto';
import { RepoRequest, RepoResponse } from '../DTO/repo.dto';
import fs from 'fs';

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
        async getRepo(owner: string, repoName: string) {
            const request = await this.request.get(`/api/v1/repos/${owner}/${repoName}`,{
                headers: this.headers
            })
            expect((request).status()).toBe(200)
            const body = await request.json()
            const repo: RepoResponse = {
                id: body.id,
                name: body.name,
                link: body.link,
                description: body.description,
                created: body.created_at
            }
            return repo;
        }
        
}