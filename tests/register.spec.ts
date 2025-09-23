import { test, expect } from '@playwright/test';
import RegisterPage from '../pom/pages/RegisterPage';

test.describe('Register user tests', () => {
    let reg: RegisterPage;
    
    test.beforeEach(async ({page}) => {
        reg = new RegisterPage(page);
        await reg.openPage();
    })
    
   test('register valid user', async ({page}) => {
    let password = 'Test123!'
    let username = 'TestUser'
    await reg.registerNewUser(username, 'testmail@gmail.com', password);
    await expect(page.locator('//span[@class="text"]//span[contains(@class, "gt-ellipsis")]')).toHaveText(username);

   })
   test('Verify Error message with user is already registered', async() => {
    let password = 'Test123!'
    let username = 'TestUser'
    await reg.registerNewUser(username, 'testmail@gmail.com', password);
    await reg.verifyErrorMessageIsShown();
    await expect(reg.ErrorMessage).toContainText('The username is already taken')
   })

    test('Redirection to Register page', async({page}) => {
        await reg.clickSignInLink();
        await expect(page).toHaveURL('/user/login')
    })
})