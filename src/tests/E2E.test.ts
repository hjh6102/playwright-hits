import { test, expect, chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { OtpPage } from '../pages/OtpPage';
import { ProjectListPage } from '../pages/ProjectListPage';

test.describe('Hyperlab E2E Tests', () => {
    let browser: Browser;
    let context: BrowserContext;
    let page: Page;
    let loginPage: LoginPage;
    let otpPage: OtpPage;
    let projectListPage: ProjectListPage;

    test.beforeEach(async ({ }, testInfo) => {
        try {
            // 브라우저 및 페이지 설정
            browser = await chromium.launch({ 
                headless: false,
                timeout: 30000 // 30초 타임아웃 설정
            });
            context = await browser.newContext({
                viewport: { width: 1280, height: 720 }
            });
            page = await context.newPage();

            // 페이지 객체 초기화
            // loginPage = new LoginPage(page);
            // otpPage = new OtpPage(page);
            // projectListPage = new ProjectListPage(page);

            // 공통 로그인 프로세스
            await loginPage.navigateToLogin();
            await page.waitForLoadState('networkidle');  // 페이지 로딩 대기
            await loginPage.clickInitialLoginButton();
            await loginPage.login('hjh6102@hits.ai', 'Test1234!');
            await otpPage.verifyOtpPage();
            await otpPage.enterOtp('000000');
            await projectListPage.verifyProjectListPage();
        } catch (error) {
            console.error(`Test setup failed: ${error}`);
            throw error;
        }
    });

    test.afterEach(async () => {
        try {
            await context?.close();
            await browser?.close();
        } catch (error) {
            console.error(`Failed to close browser: ${error}`);
        }
    });


    test('should complete login process with OTP', async () => {
        // 로그인이 이미 beforeEach에서 완료되었으므로,
        // 추가적인 검증만 수행
        const currentUrl = page.url();
        expect(currentUrl).toContain('qa.hyperlab.hits.ai');
    });

    test('should create new project', async () => {
        const projectName = `Test Project ${Date.now()}`;
        await projectListPage.createNewProject(projectName);
        // TODO: 프로젝트 생성 확인 로직 추가
    });

    // 추가 테스트 케이스들을 여기에 작성할 수 있습니다.
    test('should list all projects', async () => {
        // TODO: 프로젝트 목록 조회 테스트 구현
    });

    test('should edit project details', async () => {
        // TODO: 프로젝트 수정 테스트 구현
    });
});