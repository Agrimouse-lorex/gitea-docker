import test, { expect } from '@playwright/test'

test.skip('API test', async({page}) => {
    
    await page.goto('https://demoqa.com/login');
    page.on('request', request => console.log('Request:',
         request.method(), request.url()));
    page.on('response', response => console.log('Response:', 
        response.status(), response.url()));

    await page.locator('#userName').fill('testuserfl10414');
    await page.locator('#password').fill('Test123!');
    await page.locator('#login').click();
})

// test('Mock response - fake name', async({page}) => {
//     const fakeNameResponseBody = {
//     "userId": "40daa094-61df-4b41-b3cf-98ee2e48ead4",
//     "username": "testuserfl10414",
//     "books": [
//         {
//             "isbn": "9781449331818",
//             "title": "Learning JavaScript Design Patterns",
//             "subTitle": "A JavaScript and jQuery Developer's Guide",
//             "author": "Addy Osmani",
//             "publish_date": "2020-06-04T09:11:40.000Z",
//             "publisher": "O'Reilly Media",
//             "pages": 254,
//             "description": "With Learning JavaScript Design Patterns, you'll learn how to write beautiful, structured, and maintainable JavaScript by applying classical and modern design patterns to the language. If you want to keep your code efficient, more manageable, and up-to-da",
//             "website": "http://www.addyosmani.com/resources/essentialjsdesignpatterns/book/"
//         }
//     ]
// }

// await page.route('**/V1/User/**', route => route.fulfill({
//   status: 200,
//   body: JSON.stringify(fakeNameResponseBody),
// }));

// await page.goto('https://example.com');

//     await page.goto('https://demoqa.com/login')
//     await page.locator('#userName').fill('testuserfl10414');
//     await page.locator('#password').fill('Test123!');
//     await page.locator('#login').click();
// })
test.describe.skip('API Requests', () => {
    let token: string
    
    test.beforeAll(async({request}) => {
        const response = await request.post('https://bookstore.toolsqa.com/Account/v1/GenerateToken', {
            data: {
                "userName": "testuserfl10414",
                "password": "Test123!"
            }
        })
        const body = await response.json();
        expect(body).toHaveProperty("token");
        token = body.token;

    })

test('Get all books', async({request}) => {
    const response = await request.get('https://bookstore.toolsqa.com/BookStore/v1/Books');
    const body = await response.json();
    expect(body.books[0].title).toBe('Git Pocket Guide')
})


test('Add a book to user', async({request}) => {
    const response = await request.post('https://bookstore.toolsqa.com/BookStore/v1/Books', {
        data: {
        "userId": "40daa094-61df-4b41-b3cf-98ee2e48ead4",
        "collectionOfIsbns": [
            {"isbn": "9781449337711"} // Designing Evolvable Web APIs with ASP.NET
            ]
        },
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const body = await response.json();
    console.log(body)
})


})
