import { Locator } from "@playwright/test";
import BasePage from "../BasePage";

export default class UserSettingsMenu extends BasePage {
    private readonly applicationsMenuItem: Locator = this.page.getByRole('link', { name: 'Applications' });

    async clickApplicationsMenuItem() {
        await this.applicationsMenuItem.click();
    }
}