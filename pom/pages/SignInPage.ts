import { expect, Locator } from "@playwright/test";
import BasePage from "../BasePage";

export default class SignInPage extends BasePage {
    private readonly userNameField : Locator = this.page.locator('//input[@id="user_name"]')
    private readonly passwordField : Locator = this.page.locator('//input[@id="password"]')
    private readonly signInButton : Locator = this.page.locator('//button[contains(@class, "primary")]')
    private readonly forgotPasswordLink : Locator = this.page.locator('//a[@href="/user/forgot_password"]')
    private readonly registerNowLink : Locator = this.page.locator('//div[@class="field"]//a[@href="/user/sign_up"]')
    private readonly wrongCredentialsMessage : Locator = this.page.locator('//div[contains(@class, "flash-error")]//p')

    async openPage() {
        await this.page.goto('/user/login');
    }
    async fillUsernameField(username: string) {
        await this.userNameField.fill(username);
    }
    async fillPasswordField(password: string) {
        await this.passwordField.fill(password);
    }
    async clickLoginButton() {
        await this.signInButton.click();
    }
    async signInWithCredentials(username: string, password: string) {
        await this.openPage();
        await this.fillUsernameField(username);
        await this.fillPasswordField(password);
        await this.clickLoginButton();
    }
    async clickForgotPasswordLink() {
        await this.forgotPasswordLink.click();
    }
    async clickRegisterNowLink() {
        await this.registerNowLink.click();
    }
    async verifyErrorMessageForFieldIsShown(fieldname: string) {
        let elementToCheck: Locator;
        if(fieldname === 'userName') {
            elementToCheck = this.userNameField;
        } else {
            elementToCheck = this.passwordField;
        }
        await expect(elementToCheck).toHaveJSProperty('validationMessage', 'Please fill out this field.');
    }
    async verifyWrongCredentialsMessageIsShown() {
        await expect(this.wrongCredentialsMessage).toBeVisible()
        await expect(this.wrongCredentialsMessage).toHaveText('Username or password is incorrect.')

    }
}