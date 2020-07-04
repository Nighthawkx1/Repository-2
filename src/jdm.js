const browser = await puppeteer.launch();
const page = await browser.newPage();
const nameClass = "name";
const addressClass = "address";
const entryClass = "entry-content";
const emailClass = "email";
const phoneClass = "p";
const website = "https://www.nessa.org/members/";
const selectors = {
    "name": buildSelector(nameClass, 'a'),
    "address": buildSelector(addressClass, false),
    "website": buildSelector(entryClass, " h3 a"),
    "business": buildSelector(entryClass, " h2"),
    "email": buildSelector(emailClass, ' a'),
    "phone": buildSelector(phoneClass, false)
};
let companies = [];

async function start() {


    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(website, {
        waitUntil: "networkidle2"
    });
    const links = await page.evaluate(function(selectors.name){
        const anchors = Array.from(document.querySelectorAll(selectors.name));
        return anchors.map((anchor) => {
            const title = anchor.textContent.trim();
            return anchor.href;
        });
    }, selectors.name);
    console.log(links);


    links.forEach((url) => {
        console.log(url)
        await page.goto(url, {
            waitUntil: "networkidle2"
        });
        const links2 = await page.evaluate((dataSelector) => {
            let company = {};
            Object.Values(selectors).forEach((sel, name) => {
                let info = await page.$eval(sel, el => el.innerText);
                company[name] = info;
            })
            companies.push(company);
        })
    })

    console.log(companies);





    function buildSelector(t, a) {
        let r = '';
        // if(a){
        r = `.${entryClass} ${(a ? `.${a}` : '')}`;
        // }else{
        r = `.${entryClass} ${t} ${(t ? `.${t}` : '')}`;
        // }
        console.log(r);
        return r;
    }
};
