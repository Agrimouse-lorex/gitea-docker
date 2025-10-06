import { expect, Locator, Page } from "@playwright/test";
import BasePage from "../BasePage";

export default class OrganizationPage extends BasePage {
    private readonly orgName: Locator = this.page.getByTestId('org_name');
    private readonly visibilityCheck: Locator = this.page.locator('div.inline-right');
    private readonly permissionCheck: Locator = this.page.locator('input[type="checkbox"]');
    private readonly createButton: Locator = this.page.getByRole('button', {name: 'Create Organization'});

    async expectAllFieldsVisible() {
        const locators = [
            this.orgName,
            this.visibilityCheck,
            this.permissionCheck,
            this.createButton,
        ];
        for (const l of locators) {
            await expect.soft(l).toBeVisible();
        }
    }
    async openPage() {
        await this.page.goto('/org/create')
    }
    async inputOrgName(name: string) {
        await this.orgName.fill(name)
    }
    async selectVisibilityRadioOption(value: 0 | 1 | 2) {
        const radio = this.page.locator(
        `input[type="radio"][name="visibility"][value="${value}"]`
        );
        await expect(radio).toBeVisible();
        await radio.check();    
        await expect(radio).toBeChecked();
    }
    async checkPermissionCheckbox() {
        await this.permissionCheck.check()
        await expect(this.permissionCheck).toBeChecked();
    }
    async clickCreateOrgButton() {
        await this.createButton.click()
    }
    async verifyOrgCreation() {
        await expect(this.page.locator('a.active.item.tw-ml-auto')).toBeVisible()
    }
}
