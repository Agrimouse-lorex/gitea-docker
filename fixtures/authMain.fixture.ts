import { test as base, expect, Page, BrowserContext } from '@playwright/test';
import MainPage from '../pom/pages/MainPage';

type Fixtures = {
  authContext: BrowserContext;
  authPage: Page;
  mainPageAuth: MainPage;
};

const STORAGE_STATE_PATH = './test-data/test-states/savedUser-login-state.json';

export const test = base.extend<Fixtures>({
  authContext: async ({ browser, baseURL }, use) => {
    const context = await browser.newContext({
      storageState: STORAGE_STATE_PATH,
    });
    await use(context);
    await context.close();
  },

  authPage: async ({ authContext }, use) => {
    const page = await authContext.newPage();
    await use(page);
    await page.close();
  },

  mainPageAuth: async ({ authPage }, use) => {
    const mainPage = new MainPage(authPage);
    await authPage.goto('/');
    await expect(mainPage.userName).toBeVisible();
    await use(mainPage);
  },
});
