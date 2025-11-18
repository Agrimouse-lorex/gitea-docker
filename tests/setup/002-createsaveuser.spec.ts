import { test, expect, APIRequestContext, Page } from '@playwright/test';
import RegisterPage from '../../pom/pages/RegisterPage';
import SignInPage from '../../pom/pages/SignInPage';
import CreateRepositoryPage from '../../pom/pages/CreateRepositoryPage';
import fs from 'fs';



function setEnv(key: string, value: string) {
    const envFile = '.env';
    let env = '';

    if (fs.existsSync(envFile)) {
        env = fs.readFileSync(envFile, 'utf-8');
    }

    const formatted = `${key} = "${value}"`;
    const regex = new RegExp(`^#\\s*${key}\\s*=.*$`, 'm');

    if (regex.test(env)) {
        // оновити існуючий запис
        env = env.replace(regex, formatted);
    } else {
        // додати у кінець
        if (env.length > 0 && !env.endsWith('\n')) env += '\n';
        env += formatted + '\n';
    }

    fs.writeFileSync(envFile, env);
}
test.describe("Creating new user and saving its state", () => {
let signInPage: SignInPage;
let registerPage: RegisterPage;
let createRepoPage: CreateRepositoryPage;
let PAT = ''
let ctx;

test('Create user and save state', async({page}) => {
    const randomPref = Date.now();
    const username = `Qa_Auto_User${randomPref}`
    const password = "Test123!"
    const email = `olektrom+${randomPref}@qamadness.com`
    signInPage = new SignInPage(page);
    createRepoPage = new CreateRepositoryPage(page);
    registerPage = new RegisterPage(page);

    await registerPage.openPage();
    await registerPage.registerNewUser(username,email,password);
    await expect(page.locator('//span[@class="text"]//span[contains(@class, "gt-ellipsis")]')).toHaveText(username);

    await page.context().storageState({path: './test-data/test-states/testuser1-state.json'})
})
test('Create and save PAT token', async({browser}) => {
        ctx = await browser.newContext({
            storageState: './test-data/test-states/testuser1-state.json'
        }); 
        const p: Page = await ctx.newPage();

        await p.goto('/user/settings/applications')
        //await p.locator('body > div > div > div > div.flex-container-main > div.user-setting-content > div:nth-child(3) > details > summary').click();
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
        setEnv('ADMIN_TOKEN_AUTO', PAT);
        console.log('PAT: ', PAT);
})
})