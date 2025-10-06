import { test, expect } from '@playwright/test';
import RegisterPage from '../../pom/pages/RegisterPage';
import SignInPage from '../../pom/pages/SignInPage';
import CreateRepositoryPage from '../../pom/pages/CreateRepositoryPage';


test.describe("Creating new user and saving its state", () => {
let signInPage: SignInPage;
let registerPage: RegisterPage;
let createRepoPage: CreateRepositoryPage;

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
})