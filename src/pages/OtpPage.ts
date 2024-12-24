import { Page } from 'playwright';

export class OtpPage {
    private page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }

    async verifyOtpPage() {
        const currentUrl = this.page.url();
        if (!currentUrl.startsWith('https://qa.hyperlab.hits.ai/lab/auth/2fa')) {
            throw new Error('Not on OTP page');
        }
    }

    async enterOtp(otpValue: string) {
        const otpFields = this.page.locator('input[aria-label$="field"]');
        for (let i = 0; i < otpValue.length; i++) {
            await otpFields.nth(i).fill(otpValue[i]);
        }
        // OTP 입력 후 자동 이동 대기
        await this.page.waitForNavigation({ timeout: 5000 }).catch(() => {});
    }
}