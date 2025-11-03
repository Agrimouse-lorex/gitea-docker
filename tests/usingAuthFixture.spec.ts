import { expect } from '@playwright/test';
import { test } from '../fixtures/authMain.fixture';

test.describe('Using auth fixture with storage state', () => {
  test('Open main page as logged-in user and navigate', async ({ mainPageAuth, authPage }) => {
    await expect(mainPageAuth.userName).toBeVisible();

    await mainPageAuth.clickNewRepositoryButton();
    await expect(authPage).toHaveURL('/repo/create');
  });
});
