import { expect, Locator, Page } from "@playwright/test";
import BasePage from "../BasePage";

export default class MainPage extends BasePage {
    readonly userName: Locator = this.page.locator('//span[@class="text"]//span[contains(@class, "gt-ellipsis")]')
   private readonly createRepositoryButton: Locator = this.page.locator('//a[contains(@data-tooltip-content, "New Repository")]')


   async clickNewRepositoryButton() {
    await this.createRepositoryButton.click();
    await expect(this.page).toHaveURL('/repo/create')
   }
}

