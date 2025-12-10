import test, { expect } from "@playwright/test";

test('install Gitea with basic settings', async({page}) => {
    test.setTimeout(60000)
    await page.goto('')
    await page.getByText('install Gitea').click();
    await expect(page.getByTestId('navbar-logo')).toBeVisible({timeout: 50000})
})
// test('Check after-installation page',async({page}) => {
//     test.setTimeout(30000)
//     await page.goto('/user/login');
//     await expect(page.getByTestId('navbar-logo')).toBeVisible({timeout: 50000})
// })