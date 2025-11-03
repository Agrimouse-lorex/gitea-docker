import test, {APIRequestContext, expect, request as baseRequest, Page } from '@playwright/test'
import { users } from '../../test-data/testUsers';
import SignInPage from '../../pom/pages/SignInPage';

test.describe('API Requests', () => {
    
    const USER = users.testUser1.username;
    const PASS = users.testUser1.password;
    let PAT = ''
    let ctx, p;
    let signIn: SignInPage;
    let api: APIRequestContext;

    test.beforeAll(async({browser}) => {
        ctx = await browser.newContext(); 
        const p: Page = await ctx.newPage();
        signIn = new SignInPage(p);
        await signIn.signInWithCredentials(USER,PASS)

        await p.goto('/user/settings/applications')
        await p.locator('summary:has(h4:has-text("Generate New Token"))').click();
        await p.locator('table.ui.table').first().waitFor();
        const rwRadios = p.locator('input[type="radio"][name^="scope-"][value^="write:"]');
        const n = await rwRadios.count();
        
        for (let i = 0; i < n; i++) {
        await rwRadios.nth(i).check();
        }
        await p.locator('#name').fill(`Token-${Date.now()}`)
        await p.getByRole('button', {name: 'Generate Token'}).click()
        await expect(p.locator('div.ui.info.message p')).toBeVisible();
        PAT = await p.locator('div.ui.info.message p').innerText()
        console.log('PAT: ', PAT);
    
    })
test.beforeEach(async () => {
    api = await baseRequest.newContext({
      extraHTTPHeaders: {
        Authorization: `token ${PAT}`,
        'Content-Type': 'application/json',
      },
    });
  });

test('Get all users', async() => {
    const response = await api.get(`http://localhost:3000/api/v1/user`)
        const body = await response.json();
        console.log(body);
})
})

test.describe('Generate Token via API not UI', () => {
    test.beforeAll(async({request}) => {
        
    })
})