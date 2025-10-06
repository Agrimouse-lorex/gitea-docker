import { expect } from '@playwright/test';
import { test } from '../fixtures/authMain.fixture';

test.describe('Using auth fixture with storage state', () => {
  test('Open main page as logged-in user and navigate', async ({ mainPageAuth, authPage }) => {
    // mainPageAuth is initialized and preconditioned (opened and authenticated)
    await expect(mainPageAuth.userName).toBeVisible();

    // Example action: open Create Repository via main page button
    await mainPageAuth.clickNewRepositoryButton();
    await expect(authPage).toHaveURL('/repo/create');
  });
});
