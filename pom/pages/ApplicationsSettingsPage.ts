import BasePage from '../BasePage';
import { UserData } from '../../test-data/interfaces/user-data.interface'
import * as fs from 'fs';
import * as path from 'path';
import { expect } from '@playwright/test';

export default class ApplicationsSettingsPage extends BasePage {
    generateTokenButton = this.page.getByRole('button', { name: 'Generate Token' });
    tokenNameInput = this.page.locator('#name');
    permissionsDropdown = this.page.getByText('Select permissions');
    activitypubSelect = this.page.getByLabel('activitypub');
    issueSelect = this.page.getByLabel('issue');
    miscSelect = this.page.getByLabel('misc');
    notificationSelect = this.page.getByLabel('notification', { exact: true });
    organizationSelect = this.page.getByLabel('organization');
    packageDropdown = this.page.getByText('packageNo AccessReadRead and');
    packageSelect = this.page.getByLabel('package');
    repositorySelect = this.page.getByLabel('repository');
    userSelect = this.page.getByLabel('user');
    generatedToken = this.page.locator('.flash-info p');

    async clickGenerateTokenButton() {
        await this.generateTokenButton.click();
    }

    async fillTokenName(name: string) {
        await this.tokenNameInput.fill(name);
    }

    async selectActivityPubPermission() {
        await this.activitypubSelect.selectOption('write:activitypub');
    }

    async selectIssuePermission() {
        await this.issueSelect.selectOption('write:issue');
    }

    async selectMiscPermission() {
        await this.miscSelect.selectOption('write:misc');
    }

    async selectNotificationPermission() {
        await this.notificationSelect.selectOption('write:notification');
    }

    async selectOrganizationPermission() {
        await this.organizationSelect.selectOption('write:organization');
    }

    async openPackageDropdown() {
        await this.packageDropdown.click();
    }

    async selectPackagePermission() {
        await this.packageSelect.selectOption('write:package');
    }

    async selectRepositoryPermission() {
        await this.repositorySelect.selectOption('write:repository');
    }

    async selectUserPermission() {
        await this.userSelect.selectOption('write:user');
    }
    
    async selectAllPermissions(tokenName: string) {
        await this.clickGenerateTokenButton();
        await this.fillTokenName(tokenName)
         await this.page.locator('table.ui.table').first().waitFor();
        const rwRadios = this.page.locator('input[type="radio"][name^="scope-"][value^="write:"]');
        const n = await rwRadios.count();
        
        for (let i = 0; i < n; i++) {
        await rwRadios.nth(i).check();
        }
        await this.clickGenerateTokenButton();
    }

    async generateTokenWithAllPermissions(tokenName: string) {
        await this.clickGenerateTokenButton();
        await this.fillTokenName(tokenName);
        await this.selectActivityPubPermission();
        await this.selectIssuePermission();
        await this.selectMiscPermission();
        await this.selectNotificationPermission();
        await this.selectOrganizationPermission();
        await this.openPackageDropdown();
        await this.selectPackagePermission();
        await this.selectRepositoryPermission();
        await this.selectUserPermission();
        await this.clickGenerateTokenButton();
    }

    // Saves PAT (token) to the user object and the test users file
    // Used to update user data after token generation
    async saveGeneratedTokenToUser(user: UserData, userKey: string = 'randomUser1') {
        let token = await this.generatedToken.textContent();
        user.PAT = token!;
        const usersFilePath = path.resolve(process.cwd(), 'test-data/generatedUsers.json');      
        let usersData: any = {};
        if (fs.existsSync(usersFilePath)) {
            usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
        }
        usersData[userKey] = user;
        fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2), 'utf-8');
    }
}