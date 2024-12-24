import { Page } from 'playwright';

export class LoginPage {
    private page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }

    async navigateToLogin() {
        await this.page.goto('https://qa.hyperlab.hits.ai');
        const redirectedUrl = this.page.url();
        if (redirectedUrl !== 'https://hyperlab-qa.framer.website/') {
            throw new Error('Failed to redirect to login page');
        }
    }

    async clickInitialLoginButton() {
        const loginButton = this.page.locator('text=로그인');
        await loginButton.click();
        await this.page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    }

    async login(email: string, password: string) {
        await this.page.fill('input[name="email"]', email);
        await this.page.fill('input[name="password"]', password);
        
        const loginSubmitButton = this.page.locator('button:text("로그인")');
        await loginSubmitButton.click();
        await this.page.waitForNavigation({ waitUntil: 'domcontentloaded' });
    }
}