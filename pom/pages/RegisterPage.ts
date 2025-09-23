import { expect, Locator, Page } from "@playwright/test";
import BasePage from "../BasePage";

export default class RegisterPage extends BasePage {
    private readonly userNameField : Locator = this.page.locator('//input[@id="user_name"]')
    private readonly emailField : Locator = this.page.locator('//input[@id="email"]')
    private readonly passwordField : Locator = this.page.locator('//input[@id="password"]')
    private readonly confirmPasswordField : Locator = this.page.locator('//input[@id="retype"]')
    private readonly registerButton : Locator = this.page.locator('//button[contains(@class, "primary")]')
    private readonly signInNow : Locator = this.page.locator('//div[@class="field"]//a[@href="/user/login"]')
    readonly ErrorMessage : Locator = this.page.locator('//div[contains(@class, "flash-error")]//p')


    async openPage() {
        await this.page.goto('/user/sign_up')
    }
    async fillUsernameField(username: string) {
        await this.userNameField.fill(username);
    }
    async fillEmailField(email: string) {
        await this.emailField.fill(email);
    }
    async fillPasswordField(password: string) {
        await this.passwordField.fill(password);
    }
    async fillConfirmPasswordField(password: string) {
        await this.confirmPasswordField.fill(password);
    }
    async clickRegisterButton() {
        await this.registerButton.click();
    }
    async clickSignInLink() {
        await this.signInNow.click();
    }
    async verifyErrorMessageIsShown() {
        await expect(this.ErrorMessage).toBeVisible()
    }
    async registerNewUser(username: string, email: string, password: string){
        await this.fillUsernameField(username);
        await this.fillEmailField(email);
        await this.fillPasswordField(password)
        await this.fillConfirmPasswordField(password)
        await this.clickRegisterButton();
    }
}