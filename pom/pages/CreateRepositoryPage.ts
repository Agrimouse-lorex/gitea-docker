import { expect, Locator, Page } from "@playwright/test";
import BasePage from "../BasePage";

export default class CreateRepositoryPage extends BasePage {
    private readonly ownerField: Locator = this.page.locator('#repo_owner_dropdown');
    readonly repositoryNameField: Locator = this.page.locator('//input[@id="repo_name"]');
    private readonly visibilityCheckbox: Locator = this.page.locator('//input[@name="private"]')
    private readonly descriptionField: Locator = this.page.getByTestId('description')
    private readonly templateField: Locator = this.page.getByTestId('repo_template_search').getByRole('combobox')
    private readonly issueLabelsField: Locator = this.page.getByTestId('non_template').locator('div').filter({ hasText: 'Issue Labels Select an issue' }).getByRole('combobox')
    private readonly gitIgnore: Locator = this.page.getByTestId('non_template').locator('div').filter({ hasText: '.gitignore Select .gitignore' }).getByRole('combobox')
    private readonly licenseField: Locator = this.page.locator('#non_template > div:nth-child(4) > div > input.search')
    private readonly readMe: Locator = this.page.getByText('Default Default')
    private readonly initRepositoryCheckbox: Locator = this.page.getByTestId('_aria_auto_id_8')
    private readonly defaultBranch: Locator = this.page.getByTestId('default_branch')
    private readonly objectFormat: Locator = this.page.locator('#non_template > div:nth-child(8) > div')
    private readonly templateCheckbox: Locator = this.page.getByTestId('_aria_auto_id_9')
    private readonly createRepoButton: Locator = this.page.getByRole('button', { name: 'Create Repository' })

    async expectAllFieldsVisible() {
        const locators = [
            this.ownerField,
            this.repositoryNameField,
            this.visibilityCheckbox,
            this.descriptionField,
            this.templateField,
            this.issueLabelsField,
            this.gitIgnore,
            this.licenseField,
            this.readMe,
            this.initRepositoryCheckbox,
            this.defaultBranch,
            this.objectFormat,
            this.templateCheckbox,
            this.createRepoButton,
        ];
        for (const l of locators) {
            await expect.soft(l).toBeVisible();
        }
    }
    async openPage() {
        await this.page.goto('/repo/create');
    }
    async selectOwner(userName: string) {
        await this.ownerField.click();
        const menu = this.page.locator('#repo_owner_dropdown .menu');
        await expect(menu).toBeVisible();
        await menu.locator('.item', { hasText: userName }).click();
        await expect(this.ownerField).toContainText(userName);
    }

    async fillRepositoryName(repoName: string) {
        await this.repositoryNameField.fill(repoName)
    }
    async clickRepositoryVisibilityCheckbox() {
        await this.visibilityCheckbox.check();
        await expect(this.visibilityCheckbox).toBeChecked();
    }
    async fillDescriptionField(description: string) {
        await this.descriptionField.fill(description);
    }
    async checkTemplateOptions(): Promise<boolean> {
        const container = this.page.getByTestId('repo_template_search');
        await this.templateField.click();

        let options = container.getByRole('option');
        let count = await options.count();

        if (count === 0) {
            const menu = container.locator('.menu');
            await menu.waitFor({ state: 'visible', timeout: 1500 }).catch(() => {});
            options = menu.locator('.item:not(.disabled)');
            count = await options.count();
        }

        if (count > 0) {
            await options.first().click();
            return true;
        }

        await this.page.keyboard.press('Escape').catch(() => {});
        return false;
    }
    async selectDefaultIssueLabels() {
        await this.issueLabelsField.click();
        const menu = this.page.locator('#non_template .menu.transition.visible')
        await menu.locator('[data-value="Default"]').click();
        await expect(this.page.locator('#non_template .ui.search.selection.dropdown .text').first()).toContainText(/Default/i);
    }
    async selectGitIgnore() {
        await this.gitIgnore.click();
        const menu = this.page.locator('#_aria_auto_id_29')
        await expect(menu).toBeVisible();
        await menu.locator('//div[@data-value="Android"]').click();
        await expect(this.page.locator('//a[@data-value="Android"]')).toBeVisible();
    }
    async selectLicense() {
        await this.licenseField.click();
        const menu = this.page.locator('#_aria_auto_id_300')
        await expect(menu).toBeVisible();
        await menu.locator('//div[@data-value="EPL-2.0"]').click();
        await expect(this.page.locator('#non_template > div:nth-child(4) > div > div.text')).toContainText(/EPL-2.0/i);
    }
    async clickInitRepoCheckbox() {
            await this.initRepositoryCheckbox.check();
            await expect(this.initRepositoryCheckbox).toBeChecked();
    }
    async fillDefaultBranchName(branchName: string) {
        await this.defaultBranch.fill(branchName);
    }
    async selectObjectFormat() {
        await this.objectFormat.click();
        const menu = this.page.locator('#_aria_auto_id_332')
        await expect(menu).toBeVisible();
        await menu.locator('//div[@data-value="sha256"]').click();
        await expect(this.objectFormat).toContainText(/sha256/i);
    }
    async checkMakeARepoTemplate() {
        await this.templateCheckbox.check();
        await expect(this.templateCheckbox).toBeChecked();
    }
    async clickCreateRepoButton() {
        await this.createRepoButton.click();
}
}
// #non_template > div:nth-child(8) > div