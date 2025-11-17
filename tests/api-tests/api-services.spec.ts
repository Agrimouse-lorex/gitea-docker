import test, {expect} from '@playwright/test'
import RepositoryService from '../../api/services/RepositoryService';
import { UserFactory } from '../../api/factory/user.factory';
import { TestUserResponse } from '../../api/DTO/user.dto';
import { RepoFactory } from '../../api/factory/repo.factory';
import { RepoResponse } from '../../api/DTO/repo.dto';
import MainService from '../../api/services/MainService';

    const PAT = process.env.ADMIN_TOKEN as string
    let mainService: MainService;
    let repositoryService: RepositoryService
test.describe('API tests with Service, DTO, Factory architecture', () => {

    test.beforeEach(async({request}) => {
        mainService = new MainService(request)
        mainService.setToken(`${PAT}`)
        repositoryService = new RepositoryService(request)
        repositoryService.setToken(`${PAT}`)
        });
            test('Get all users', async() => {
                console.log(PAT)
                const response = await mainService.getAllUsersAsAdmin()  
                const body = await response.json()
                body.forEach((u:any) => console.log("User ID and Login: ", u.id, u.login, "\nUser Email: ", u.email, "\n"))
            })
            test('Create test User',async() => {
                const testUser = UserFactory.create();
                const request = await mainService.createUser(testUser)
                const body: TestUserResponse = await request.json();
                expect(request.status()).toBe(201);
                console.log("Created user: ", body)
                expect(body.email).toBe(testUser.email);
                expect(body.username).toBe(testUser.username);
                expect(body.id).toBeGreaterThan(0);
                expect(typeof body.created).toBe('string');
            })
            test('Block Last Created user', async() => {
                const request = await mainService.blockLastUser()
                expect(request.status()).toBe(204);
            })
            test('Block Specified User',async() => {
                const request = await mainService.blockCertainUser('QA_Auto_User1762170652099')
                expect(request.status()).toBe(204)
            })

            test('Verify Blocked user',async() => {
                const request = await mainService.blockUserCheck('QA_Auto_User1762170652099')
                expect(request.status()).toBe(204)
            })
            test('Get the List Of Blocked Users',async() => {
                const request = await mainService.blockedUsersList()
                expect(request.status()).toBe(200)
            })
            test('Unblock Specified User',async() => {
                const request = await mainService.unblockCertainUser('QA_Auto_User1762170652099')
                expect(request.status()).toBe(204)
            })
            test('Unblock Last User',async() => {
                const request = await mainService.unblockLastUser()
                expect(request.status()).toBe(204)
            })
            
            test('Delete User Avatar', async() => {
                const request = await mainService.avatarDelete()
                expect(request.status()).toBe(204)
            })
            test('Upload User Avatar', async() => {
                const request = await mainService.avatarPost()
                expect(request.status()).toBe(204);
                console.log("Avatar has been successfully uploaded")
            })
            test('Get Repositories list',async() => {
            const request = await mainService.getRepoList()
            console.log(request)
            })
test.describe('tests with Repository Service included', () => {
    const repoData = RepoFactory.create();
    let owner: string
    let repo: string;

            test('Create Repository',async() => {
            const request = await mainService.createRepo(repoData)
            const body: RepoResponse = await request.json()
            expect(request.status()).toBe(201)
            repo = body.name;
            console.log(body.name, "Repository is created", body.created)
            })
          test('Get this user' ,async() => {
            const user = await mainService.getUserData()
            expect(user).toBeDefined()
            owner = user.username;
            console.log("loginned user: ", user)
          })
          test('Get newly created repository', async() => {
            const response = await repositoryService.getRepo(owner, repo)
            console.log("Repository created in that test: ", response)
          })
          test('Change repositories properties', async() => {
            const defaultBranch: string = 'main-patched'
            const request = await repositoryService.patchRepo(owner,repo,defaultBranch)
            console.log("Repository is patched: ",request)
            repo = request.name
            console.log(repo)
          })

          
    })
})