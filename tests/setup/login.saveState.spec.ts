// import { test, expect } from '@playwright/test';
// import SignInPage from '../../pom/pages/SignInPage';
// import { users } from '../../test-data/testUsers';

// // This setup test signs in with an existing user and saves storage state
// test.describe.skip('Login and save storage state', () => {
//   test('Sign in and persist state', async ({ page }) => {
//     const signIn = new SignInPage(page);

//     await signIn.openPage();
//     await signIn.signInWithCredentials(users.testUser1.username, users.testUser1.password);

//     // basic post-login sanity: avatar/username visible somewhere on the page after redirect
//     await expect(page.locator('//span[@class="text"]//span[contains(@class, "gt-ellipsis")]')).toBeVisible();

//     await page.context().storageState({ path: './test-data/test-states/savedUser-login-state.json' });
//   });
// });

