import { expect, Locator } from "@playwright/test";
import BasePage from '../BasePage';

export default class Header extends BasePage {

    private readonly userAvatar: Locator = this.page.locator('.navbar-right img');
    private readonly settingsMenuItem: Locator = this.page.locator('#_aria_auto_id_8');

    async clickUserAvatar() {
        await this.userAvatar.click();
    }
    async clickSettingsMenuItem() {
        await this.settingsMenuItem.click();
    }

}