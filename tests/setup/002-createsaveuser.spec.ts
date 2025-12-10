import { test } from '@playwright/test';
import RegisterPage from '../../pom/pages/RegisterPage';
import Header from '../../pom/modules/Header';
import UserSettingsMenu from '../../pom/modules/UserSettingsMenu';
import ApplicationsSettingsPage from '../../pom/pages/ApplicationsSettingsPage';
test.describe('Repository Creation', () => {
    let registerPage: RegisterPage;
    let header: Header;
    let userSettingsMenu: UserSettingsMenu;
    let applicationsSettingsPage: ApplicationsSettingsPage;

    test('Register new user1, set token and save state', async ({ page }) => {
        registerPage = new RegisterPage(page);
        header = new Header(page);
        userSettingsMenu = new UserSettingsMenu(page);
        applicationsSettingsPage = new ApplicationsSettingsPage(page);

        const randomUser1 = {
            userName: `olektrom`,
            email: `olektrom@qamadness.com`,
            password: 'Test1234',
            PAT: ''
        };

        await registerPage.openPage();
        await registerPage.registerNewUser(randomUser1.userName, randomUser1.email, randomUser1.password);
        await page.context().storageState({ path: `test-data/states/testUser1-state.json` });
        await header.clickUserAvatar();
        await header.clickSettingsMenuItem();
        await userSettingsMenu.clickApplicationsMenuItem();
        await applicationsSettingsPage.selectAllPermissions('QaAuto Token');
        await applicationsSettingsPage.saveGeneratedTokenToUser(randomUser1);
        console.log('User saved with token:', randomUser1.PAT);
    });

});