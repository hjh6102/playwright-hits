import { test, expect } from '@playwright/test';

// "로그인 및 프로젝트 목록 확인" 테스트
test('Login and verify project list navigation', async ({ page }) => {
  
  await test.step('1. 초기 URL로 이동', async () => {
    const initialUrl = 'https://qa.hyperlab.hits.ai';
    console.log(`Navigating to: ${initialUrl}`);
    await page.goto(initialUrl);
  });

  await test.step('2. 리다이렉션 확인', async () => {
    const redirectedUrl = page.url();
    const expectedRedirectUrl = 'https://hyperlab-qa.framer.website/';
    expect(redirectedUrl).toBe(expectedRedirectUrl);
    console.log(`Redirected to: ${redirectedUrl}`);
  });

  await test.step('3. "로그인" 버튼 클릭', async () => {
    const loginButton = page.locator('text=로그인');
    await expect(loginButton).toHaveCount(1);
    console.log('"로그인" 버튼을 찾았습니다. 클릭을 시도합니다.');
    await loginButton.click();
    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 });
  });

  await test.step('4. 로그인 정보 입력', async () => {
    await page.fill('input[name="email"]', 'hjh6102@hits.ai');
    console.log('이메일을 입력했습니다.');
    await page.fill('input[name="password"]', 'Test1234!');
    console.log('비밀번호를 입력했습니다.');
  });

  await test.step('5. 로그인 폼 제출', async () => {
    const loginSubmitButton = page.locator('button:text("Sign in")');
    await expect(loginSubmitButton).toHaveCount(1);
    console.log('"로그인" 제출 버튼을 찾았습니다. 클릭을 시도합니다.');
    await loginSubmitButton.click();
    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 100000 });
  });

  await test.step('6. OTP 페이지로 이동 확인', async () => {
    const otpPageUrl = 'https://qa.hyperlab.hits.ai/en/lab/auth/2fa';
    const currentOtpUrl = page.url();
    console.log(`Current URL: ${currentOtpUrl}`);
    expect(currentOtpUrl).toContain(otpPageUrl); // URL 포함 여부 확인
    await page.waitForSelector('input[aria-label$="field"]', { timeout: 10000 });
    console.log('OTP 입력 필드가 로드되었습니다.');
  });

  await test.step('7. OTP 입력', async () => {
    const otpFields = page.locator('input[aria-label$="field"]');
    const otpValue = '000000';
    for (let i = 0; i < 6; i++) {
      await otpFields.nth(i).fill(otpValue[i]);
    }
    console.log(`OTP "${otpValue}"을 입력했습니다.`);
  });

  await test.step('8. 프로젝트 목록 확인', async () => {
    const myProjectPageHeader = page.locator('text=My projects');
    await expect(myProjectPageHeader).toHaveCount(1);
    console.log('"My projects" 텍스트를 확인했습니다.');
  });

  await test.step('9. 프로젝트 생성', async () => {
    // 프로젝트 만들기 버튼 클릭
    await page.getByRole('button', { name: 'Create a new project and' }).click();
    console.log('프로젝트 만들기 버튼을 클릭했습니다.');

    // 프로젝트 이름 입력
    const projectName = 'Test Project';
    await page.fill('input[placeholder="Please enter the project name"]', projectName);
    console.log(`프로젝트 이름 "${projectName}"을 입력했습니다.`);

    // 다음 버튼 클릭
    await page.getByRole('button', { name: 'Next' }).click();
    console.log('다음 버튼을 클릭했습니다.');

    // Target protein 입력
    const targetName = 'Test Target';
    await page.fill('input[placeholder="Please enter the Target protein"]', targetName);
    console.log(`Target protein "${targetName}"을 입력했습니다.`);

    // 설정 완료 버튼 클릭
    await page.getByRole('button', { name: 'Confirm' }).click();
    console.log('설정 완료 버튼을 클릭했습니다.');

    // 지금은 건너뛰기 버튼 클릭
    await page.getByRole('button', { name: 'Skip for now' }).click();
    console.log('지금은 건너뛰기 버튼을 클릭했습니다.');
  });
});