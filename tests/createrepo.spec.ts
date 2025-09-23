import { test, expect } from '@playwright/test';
import CreateRepositoryPage from '../pom/pages/CreateRepositoryPage';
import SignInPage from '../pom/pages/SignInPage';
import { users } from '../test-data/testUsers';

test.describe('Create New Repository tests', () => {
    let signIn: SignInPage;
    let repo: CreateRepositoryPage;
    const repoName: string = "TestRepositoryName"
    const owner: string = users.testUser1.username
    
    test.beforeEach(async ({page}) => {
        repo = new CreateRepositoryPage(page);
        signIn = new SignInPage(page)
        await signIn.openPage();
        await signIn.signInWithCredentials(users.testUser1.username, users.testUser1.password);
        await repo.openPage();
        await repo.expectAllFieldsVisible();
    })
    test('Select yourself as owner in Owner Dropdown.', async() => {
        await repo.selectOwner(users.testUser1.username)
    })

    test('Fill Repository name.', async() => {
        await repo.fillRepositoryName(repoName)
    })
    test('Click Make repository private checkbox.', async() => {
        await repo.clickRepositoryVisibilityCheckbox();
    })
    test('Fill Description.', async() => {
        await repo.fillDescriptionField('Here should be any text information for the description field')
    })
    test('Select First template if there is and select none if no templates exist.', async() => {
        const selected = await repo.checkTemplateOptions();
        expect(typeof selected).toBe('boolean');
    })
    test('Select default Issue Label',async() => {
        await repo.selectDefaultIssueLabels();
    })
    test('Select gitIgnore Android', async() => {
        await repo.selectGitIgnore();
    })
    test('Select Licence EPL-2.0', async() => {
        await repo.selectLicense();
    })
    test('Select Object Format sha256', async() => {
        await repo.selectObjectFormat();
    })
    test('Create repo with empty form',async () => {
        await repo.clickCreateRepoButton();
        await expect(repo.repositoryNameField).toHaveJSProperty('validationMessage', 'Please fill out this field.');
        // await expect(page).toHaveURL(`/${owner}/${repoName}`)
    })
    test('Create full Repository',async({page}) => {
        await repo.selectOwner(users.testUser1.username)
        await repo.fillRepositoryName(repoName)
        await repo.clickRepositoryVisibilityCheckbox();
        await repo.fillDescriptionField('Here should be any text information for the description field')
        const selected = await repo.checkTemplateOptions();
        expect(typeof selected).toBe('boolean');
        await repo.selectDefaultIssueLabels();
        await repo.selectGitIgnore();
        await repo.selectObjectFormat();
        await repo.clickCreateRepoButton();
        await expect(page).toHaveURL(`/${owner}/${repoName}`)
        await page.locator('//span[@data-text="Settings"]').click();
        await page.locator('//button[@data-modal="#delete-repo-modal"]').click();
        await page.locator('#repo_name_to_delete').fill(repoName)
        await page.locator('button.ui.red.button').last().click();
        await expect(page.locator('.ui.positive.message')).toContainText(/The repository has been deleted/i)
    })
})
