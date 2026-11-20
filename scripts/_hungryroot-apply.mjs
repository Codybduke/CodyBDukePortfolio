import { chromium } from 'playwright';

const resume = '/Users/codyduke/Documents/Cursor/cody-duke-portfolio/Job Applications/companies/Hungryroot/Cody Duke Product Design Resume.pdf';
const letter = '/Users/codyduke/Documents/Cursor/cody-duke-portfolio/Job Applications/companies/Hungryroot/Cody Duke Product Design Cover Letter.pdf';
const excited = "I want to design the product that makes a healthy week easier for a household. Hungryroot already knows a person’s goals, budget, and how they eat, and the Digital team gets to turn that into groceries and a recipe they will actually cook. My work has been that kind of product: start from what you already know about someone, give them one clear next step, and make it good enough that they come back.";

console.log('Submitting Hungryroot Senior Product Designer');
console.log('Resume:', resume);
console.log('Cover letter:', letter);

const browser = await chromium.launch({ headless: false, channel: 'chrome' });
const page = await browser.newPage();
page.setDefaultTimeout(20000);
try {
await page.goto('https://job-boards.greenhouse.io/hungryroot/jobs/6242253004', { waitUntil: 'domcontentloaded' });
await page.getByRole('button', { name: 'Submit application' }).waitFor();

await page.getByLabel('First Name').fill('Cody');
await page.getByLabel('Last Name').fill('Duke');
await page.getByLabel('Email').fill('codybduke@gmail.com');
await page.locator('#resume').setInputFiles(resume);
await page.locator('#cover_letter').setInputFiles(letter);

async function choose(label, option) {
  const combo = page.getByRole('combobox', { name: label });
  await combo.click();
  const exact = page.getByRole('option', { name: option, exact: true });
  try {
    await exact.click({ timeout: 5000 });
  } catch (error) {
    const names = await page.getByRole('option').allInnerTexts();
    console.log('OPTIONS', String(label), names.slice(0, 12));
    await page.screenshot({ path: '/tmp/hungryroot-debug.png' });
    throw error;
  }
}

const country = page.getByRole('combobox', { name: /Country/ });
await country.click();
const countryOptions = await page.getByRole('option').allInnerTexts();
console.log('COUNTRY SAMPLE', countryOptions.slice(0, 5));
const united = page.getByRole('option', { name: /United States/ }).first();
if (await united.count()) await united.click();
else await page.keyboard.press('Escape');
await page.getByLabel('Phone').fill('5013395093');

const location = page.getByRole('combobox', { name: /Location \(City\)/ });
await location.click();
await location.fill('Pleasant Grove');
await page.getByRole('option', { name: 'Pleasant Grove, Utah, United States', exact: true }).click();

await choose(/5\+ years of work experience designing digital products on native apps/, 'Yes');
await choose(/high-fidelity/, 'Yes');
await choose(/Human Interface Guidelines/, 'Yes');
await page.getByLabel(/Why are you excited/).fill(excited);
await choose(/legally authorized to work in the United States/, 'Yes');
await choose(/require sponsorship/, 'No');
await page.getByLabel('LinkedIn Profile').fill('https://www.linkedin.com/in/cody-duke-aa8114127/');
await page.getByLabel(/design portfolio/).fill('https://codybduke.com/');
await choose(/^Gender/, 'Male');
await choose(/Hispanic/, 'No');
await choose(/identify your race/, 'White');
await choose(/Veteran Status/, 'I am not a protected veteran');

const files = await page.locator('input[type=file]').evaluateAll((els) => els.map((el) => el.files?.[0]?.name || ''));
console.log('Attached files:', files.join(' | '));

await page.getByRole('button', { name: 'Submit application' }).click();
await page.waitForTimeout(4000);
const body = await page.locator('body').innerText();
console.log('URL:', page.url());
console.log('BODY_START');
console.log(body.slice(0, 2500));
console.log('BODY_END');
await page.screenshot({ path: '/tmp/hungryroot-confirm.png', fullPage: true });
await browser.close();
