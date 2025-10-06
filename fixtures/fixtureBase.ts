import {test as base, Page} from "@playwright/test"

type Fixtures = {
    pageSmall: Page;
    pageMedium: Page;
    pageBig: Page;  
};

export const test = base.extend<Fixtures>({

    pageSmall: async({page}, use) => {
        await page.setViewportSize({width: 300, height: 300});
        await use(page);
        await page.waitForTimeout(2000);
    },
    pageMedium: async({page}, use) => {
        await page.setViewportSize({width: 800, height: 800});
        await use(page);
        await page.waitForTimeout(2000);
    },
    pageBig: async({page}, use) => {
        await page.setViewportSize({width: 1500, height: 1500});
        await use(page);
    }

})