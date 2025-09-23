import { test, expect } from '@playwright/test';
import SignInPage from '../pom/pages/SignInPage';
import { users } from '../test-data/testUsers';

// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });

// Sign in tests:
// Success sign in
// Sign in with empty email
// Sign in with empty password
// Sign in with wrong email/pass
// Redirect to forgot password
// Redirection to Register page
//                          User - olektrom / olektrom@qamadness.com / Test123!

test.describe('Sign in tests', () => {
    let signInPage: SignInPage;
    
    test.beforeEach(async ({page}) => {
        signInPage = new SignInPage(page);
        await signInPage.openPage();
    })
    
    test('Success sign in with username',async ({page}) => {
        await signInPage.signInWithCredentials(users.testUser1.username, users.testUser1.password)
        await expect(page.locator('//span[@class="text"]//span[contains(@class, "gt-ellipsis")]')).toHaveText(users.testUser1.username);
    })
    test('Success sign in with email',async ({page}) => {
        await signInPage.signInWithCredentials(users.testUser1.email, users.testUser1.password)
        await expect(page.locator('//span[@class="text"]//span[contains(@class, "gt-ellipsis")]')).toHaveText(users.testUser1.username);
    })
    test('Sign in with empty username/email',async () => {
        await signInPage.fillPasswordField(users.testUser1.password)
        await signInPage.verifyErrorMessageForFieldIsShown('userName')
    })
    test('Sign in with empty password',async () => {
        await signInPage.fillUsernameField(users.testUser1.username)
        await signInPage.verifyErrorMessageForFieldIsShown('password')
    })
    test('Sign in with wrong username/email or password', async() => {
        await signInPage.signInWithCredentials('invalid', 'invalid');
        await signInPage.verifyWrongCredentialsMessageIsShown();
    })
    test('Redirection to Forgot Password', async({page}) => {
        await signInPage.clickForgotPasswordLink();
        await expect(page).toHaveURL('/user/forgot_password')
    })
    test('Redirection to Register page', async({page}) => {
        await signInPage.clickRegisterNowLink();
        await expect(page).toHaveURL('/user/sign_up')
    })
})