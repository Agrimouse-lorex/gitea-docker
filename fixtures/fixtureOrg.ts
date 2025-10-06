import {test as base, Page} from "@playwright/test"
import OrganizationPage from "../pom/pages/OrganizationPage";

type Fixtures = {
    createOrgPage: OrganizationPage;

};
export const test = base.extend<Fixtures>({
    createOrgPage: async ({page}, use) => {
    let createOrgPage = new OrganizationPage(page);
    await createOrgPage.openPage();
    await use(createOrgPage);
    }
})