import { chromium} from "@playwright/test"
import { test } from "../fixtures/fixtureBase"

test("Open page without fixture",async() => {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
 
    await page.goto('/')
    await page.waitForTimeout(4000);
})

test.describe("Open pages with fixtures", () => {
test("Open page with fixture with pageSmall",async ({pageSmall}) => {
    await pageSmall.goto('/')
})
test("Open page with fixture with pageMedium",async ({pageMedium}) => {
    await pageMedium.goto('/')
})
test("Open page with fixture with pageBig",async ({pageBig}) => {
    await pageBig.goto('/')
})
}) 