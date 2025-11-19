import test, {APIRequestContext, expect, request as baseRequest, Page } from '@playwright/test'
import fs from 'fs';

    let PAT = process.env.ADMIN_TOKEN_AUTO
    let ctx;
    let api: APIRequestContext;
    const apiURL = 'http://localhost:3000/api/v1'

test.describe('Basic requests as admin user', () => {
    
    const randomPref = Date.now();
    const email = `olektrom+${randomPref}@qamadness.com`
    const username = `Qa_Auto_User${randomPref}`
    const password = 'Test123!'



    test.beforeAll(async() => {
        api = await baseRequest.newContext({
            extraHTTPHeaders: {
                Authorization: `token ${PAT}`,
                'Content-Type': 'application/json',
                },
            });
        });
    test.describe('Basic Admin requests', () => {
        test('Get all emails', async() => {
                const response = await api.get(`http://localhost:3000/api/v1/admin/emails`)
                    const body = await response.json();
                    console.log(body)
                    await expect(response).toBeOK()
            })  
            test('Get all users', async() => {
                const response = await api.get(`http://localhost:3000/api/v1/admin/users`)
                    const body = await response.json();
                    body.forEach((u:any) => console.log(u.email))
                    await expect(response).toBeOK()
            }) 
            test('Create test User',async() => {
                
                const response = await api.post('http://localhost:3000/api/v1/admin/users/', {
                    data: {
                        email,
                        username,
                        password
                    }
                })
                expect(response).toBeOK();
                console.log(await response.json())
            })
            test('As logged in user, block new-created user in previous test', async() => {
                const response = await api.put(`http://localhost:3000/api/v1/user/blocks/${username}`,{
                    data: {
                        "username": `${username}`,
                    },
                })
                    expect(response.ok()).toBeTruthy(); 
                    expect(response.status()).toBe(204); 
            })
            test('Verify user is blocked', async() => {
                const response = await api.get(`http://localhost:3000/api/v1/user/blocks/${username}`) 
                expect(response.ok()).toBeTruthy();     
                expect(response.status()).toBe(204); 

            })
            test('Unblock blocked user', async() => {
                const response = await api.delete(`http://localhost:3000/api/v1/user/blocks/${username}`)
                    expect(response.ok()).toBeTruthy(); 
                    expect(response.status()).toBe(204); 
            })
            test('Check list of blocked users', async() => {
                const response = await api.get(`http://localhost:3000/api/v1/user/blocks`)
                    expect(response.ok()).toBeTruthy(); 
                    expect(response.status()).toBe(200); 
                    const body = await response.json();
                    console.log("List of blocked users: ", body)
            })
    })
       
    test.describe('Basic requests as authenticated user', () => {
        const baseName = 'test-repository';
        const datePref = Date.now();

        test('Verify your authenticated user', async() => {
            const response = await api.get(`${apiURL}/user`)
            console.log(response.status())
            expect(response.ok()).toBeTruthy();
            const body = await response.json();
            console.log("Authenticated User Data: ",body)
        })
        test('Delete user Avatar',async() => {
            const response = await api.delete(`${apiURL}/user/avatar`)
            console.log("Delete user Avatar executed with status code: ", response.status());
            expect(response.status()).toBe(204);
        })
        test('Upload User Avatar', async() => {
            const filePath = 'D:/gitea-practice/images/Jeff.jpg';
            const base64img = fs.readFileSync(filePath, { encoding: 'base64' });
            const response = await api.post(`${apiURL}/user/avatar`, {
                data: {
                    image: base64img
                }
            })
            console.log("Upload user Avatar executed with status code: ", response.status())
            expect(response.ok()).toBeTruthy();
            expect(response.status()).toBe(204); 
        })
        test('Get repositories list for authenticated user', async() => {
            const response = await api.get(`${apiURL}/user/repos`)
            expect(response.status()).toBe(200);
            console.log("Get repositories list status code: ", response.status());
            const body = await response.json();
            console.log("User repositories list: ", body);
        })
        test('Create new repository for authenticated user', async() => {

            let repoName = baseName;

            let response = await api.post(`${apiURL}/user/repos`, {
                data: {
                    "name": repoName,
                    "default_branch": "main",
                    "description": "This is my test repository created via API request",
                }
            })
            if (response.status() === 409) {
                
                repoName = `${baseName}-${datePref}`

                response = await api.post(`${apiURL}/user/repos`, {
                data: {
                    "name": repoName,
                    "default_branch": "main",
                    "description": "This is my test repository created via API request",
                }
            })         
            }
            await expect(response).toBeOK();
            console.log('Repo created:', repoName, 'Status:', response.status());
            const body = await response.json()
            console.log('Repo', repoName, 'data: ',body)
        })
        test('Delete newly created repo', async()=>{
                const response = await api.get(`${apiURL}/user/repos`)    
                expect(response.status()).toBe(200);
                const getOwnerName = await api.get(`${apiURL}/user`)
                expect(getOwnerName.status()).toBe(200);
                const userBody = await getOwnerName.json()
                const owner = userBody.username
                const repoBody = await response.json()
                const lastObject = repoBody[repoBody.length - 1];
                const repoName = lastObject.name
                console.log("Repository to be deleted: ", repoName)
                const repoDelete = await api.delete(`${apiURL}/repos/${owner}/${repoName}`)
                await expect(repoDelete).toBeOK()
        })
    })
});


test.describe('Bulk deleting', () => {
    test.beforeAll(async({browser}) => {
        
        ctx = await browser.newContext(); 
        const p: Page = await ctx.newPage();
        api = await baseRequest.newContext({
            extraHTTPHeaders: {
                Authorization: `token ${PAT}`,
                'Content-Type': 'application/json',
                },
            });
        })


    test('delete all users except Super Admin user',async() => {
        const response = await api.get(`http://localhost:3000/api/v1/admin/emails/search`)
            const body = await response.json();
            let users = body.map((user: any) => {
                return user.username
            })
            console.log(users)
            const filtered = users.filter((user: string) => user !== 'olektrom');
            console.log(filtered)

            for(const username of filtered) {
                console.log(username)
                const response = await api.delete(`http://localhost:3000/api/v1/admin/users/${username}?purge=true`)
                await expect(response).toBeOK()
            }

            const postDeleteResponse = await api.get(`http://localhost:3000/api/v1/admin/emails/search`)
            const usersLeft = (await postDeleteResponse.json() as { username: string }[])
            .map(u => u.username);
            console.log(usersLeft)
    })
    test('delete all repositories for authenticated user',async() => {
            const getOwnerName = await api.get(`${apiURL}/user`)
            const userBody = await getOwnerName.json()
            const owner = userBody.username
            const response = await api.get(`${apiURL}/user/repos`)
            const repoBody = await response.json()
            let repos = repoBody.map((repo: any) => {
                return repo.name
            })
            console.log("List of existing repositories' names: ", repos)

            for(const name of repos) {
                console.log(name)
                const response = await api.delete(`${apiURL}/repos/${owner}/${name}`)
                await expect(response).toBeOK()
            }

            const postDeleteResponse = await api.get(`${apiURL}/user/repos`)
            const reposLeft = (await postDeleteResponse.json() as { name: string }[])
            .map(r => r.name);
            console.log("Repositories left after delete: ", reposLeft)
    })
})    