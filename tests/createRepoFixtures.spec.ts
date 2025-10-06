import { expect } from '@playwright/test';
import {test} from '../fixtures/fixtures'

test.describe('Create New Repository tests', () => {
    test.use({storageState: './test-data/test-states/testuser1-state.json'})
    test('Create empty repository', async({createRepoPage}) => {
        let testRepoName = 'Test-repository 1';
        await createRepoPage.fillRepositoryName(testRepoName)
        await createRepoPage.clickCreateRepoButton();
        await createRepoPage.verifyEmptyRepoCreated();
    })  
    test('Select yourself as owner in Owner Dropdown.', async({createRepoPage, pageSmall}) => {
        await createRepoPage.selectOwner();
    })

    test('Fill Repository name.', async({createRepoPage, pageBig}) => {
        await createRepoPage.fillRepositoryName("TestRepositoryName")
    })
    test('Click Make repository private checkbox.', async({createRepoPage}) => {
        await createRepoPage.clickRepositoryVisibilityCheckbox();
    })
    test('Fill Description.', async({createRepoPage}) => {
        await createRepoPage.fillDescriptionField('Here should be any text information for the description field')
    })
    test('Select First template if there is and select none if no templates exist.', async({createRepoPage}) => {
        const selected = await createRepoPage.checkTemplateOptions();
        expect(typeof selected).toBe('boolean');
    })
    test('Select default Issue Label',async({createRepoPage}) => {
        await createRepoPage.selectDefaultIssueLabels();
    })
    test('Select gitIgnore Android', async({createRepoPage}) => {
        await createRepoPage.selectGitIgnore();
    })
    test('Select Licence EPL-2.0', async({createRepoPage}) => {
        await createRepoPage.selectLicense();
    })
    test('Select Object Format sha256', async({createRepoPage}) => {
        await createRepoPage.selectObjectFormat();
    })
    test('Create createRepoPage with empty form',async ({createRepoPage}) => {
        await createRepoPage.clickCreateRepoButton();
        await expect(createRepoPage.repositoryNameField).toHaveJSProperty('validationMessage', 'Please fill out this field.');
        // await expect(page).toHaveURL(`/${owner}/${repoName}`)
    })
    test('Create full Repository and delete it after',async({createRepoPage, page, pageMedium}) => {
        await createRepoPage.selectOwner()
        await createRepoPage.fillRepositoryName("TestRepositoryName")
        await createRepoPage.clickRepositoryVisibilityCheckbox();
        await createRepoPage.fillDescriptionField('Here should be any text information for the description field')
        const selected = await createRepoPage.checkTemplateOptions();
        expect(typeof selected).toBe('boolean');
        await createRepoPage.selectDefaultIssueLabels();
        await createRepoPage.selectGitIgnore();
        await createRepoPage.selectObjectFormat();
        await createRepoPage.clickCreateRepoButton();
        await expect(page.getByTestId('user-content-testrepositoryname')).toHaveText("TestRepositoryName")
        await page.locator('//span[@data-text="Settings"]').click();
        await page.getByRole('button', { name: 'Delete This Repository' }).click();
        await page.locator('#repo_name_to_delete').fill("TestRepositoryName")
        await page.locator('button.ui.red.button').last().click();
        await expect(page.locator('.ui.positive.message')).toContainText(/The repository has been deleted/i)
    })
})