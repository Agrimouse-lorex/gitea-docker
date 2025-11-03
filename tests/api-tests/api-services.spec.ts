import test, {expect} from '@playwright/test'
import RepositoryService from '../../api/services/RepositoryService';
import { UserFactory } from '../../api/factory/user.factory';
import { TestUserResponse } from '../../api/DTO/user.dto';
import { RepoFactory } from '../../api/factory/repo.factory';
import { RepoResponse } from '../../api/DTO/repo.dto';

    const PAT = process.env.ADMIN_TOKEN as string
    let repositoryService: RepositoryService;
test.describe('API tests with Service, DTO, Factory architecture', () => {

    test.beforeEach(async({request}) => {
        repositoryService = new RepositoryService(request)
        repositoryService.setToken(`${PAT}`)
        });
            test('Get all users', async() => {
                console.log(PAT)
                const response = await repositoryService.getAllUsersAsAdmin()  
                const body = await response.json()
                body.forEach((u:any) => console.log("User ID and Login: ", u.id, u.login, "\nUser Email: ", u.email, "\n"))
            })
            test('Create test User',async() => {
                const testUser = UserFactory.create();
                const request = await repositoryService.createUser(testUser)
                const body: TestUserResponse = await request.json();
                expect(request.status()).toBe(201);
                console.log("Created user: ", body)
                expect(body.email).toBe(testUser.email);
                expect(body.username).toBe(testUser.username);
                expect(body.id).toBeGreaterThan(0);
                expect(typeof body.created).toBe('string');
            })
            test('Block Last Created user', async() => {
                const request = await repositoryService.blockLastUser()
                expect(request.status()).toBe(204);
            })
            test('Block Specified User',async() => {
                const request = await repositoryService.blockCertainUser('QA_Auto_User1762170652099')
                expect(request.status()).toBe(204)
            })

            test('Verify Blocked user',async() => {
                const request = await repositoryService.blockUserCheck('QA_Auto_User1762170652099')
                expect(request.status()).toBe(204)
            })
            test('Get the List Of Blocked Users',async() => {
                const request = await repositoryService.blockedUsersList()
                expect(request.status()).toBe(200)
            })
            test('Unblock Specified User',async() => {
                const request = await repositoryService.unblockCertainUser('QA_Auto_User1762170652099')
                expect(request.status()).toBe(204)
            })
            test('Unblock Last User',async() => {
                const request = await repositoryService.unblockLastUser()
                expect(request.status()).toBe(204)
            })
            
            test('Delete User Avatar', async() => {
                const request = await repositoryService.avatarDelete()
                expect(request.status()).toBe(204)
            })
            test('Upload User Avatar', async() => {
                const request = await repositoryService.avatarPost()
                expect(request.status()).toBe(204);
                console.log("Avatar has been successfully uploaded")
            })
            
            test('Create Repository',async() => {
            const repoData = RepoFactory.create();
            const request = await repositoryService.createRepo(repoData)
            const body: RepoResponse = await request.json()
            expect(request.status()).toBe(201)
            console.log(body.name, "Repository is created", body.created)
            })
            test('Get Repositories list',async() => {
            const request = await repositoryService.getRepoList()
            console.log(request)
          })
    })