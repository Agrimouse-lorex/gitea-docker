import {test as base, Page} from "@playwright/test"
import CreateRepositoryPage from "../pom/pages/CreateRepositoryPage";

type Fixtures = {
    createRepoPage: CreateRepositoryPage;

};
export const test = base.extend<Fixtures>({
    createRepoPage: async ({page}, use) => {
    let createRepoPage = new CreateRepositoryPage(page);
    await createRepoPage.openPage();
    await use(createRepoPage);
    }
})