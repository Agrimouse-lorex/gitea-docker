import test, {expect} from '@playwright/test'
import RepositoryService from '../../api/services/RepositoryService';
import { UserFactory } from '../../api/factory/user.factory';
import { TestUserResponse } from '../../api/DTO/user.dto';

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
                console.log('Admin token:', repositoryService['token']);
                console.log(process.env.ADMIN_TOKEN);
                const request = await repositoryService.createUser(testUser)
                console.log(request.status())
                const body: TestUserResponse = await request.json();
                expect(request.status()).toBe(201);
                console.log("Created user: ", body)
                expect(body.email).toBe(testUser.email);
                expect(body.username).toBe(testUser.username);
                expect(body.id).toBeGreaterThan(0);
                expect(typeof body.created).toBe('string');
            })
          
    })