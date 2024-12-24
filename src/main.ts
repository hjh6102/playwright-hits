import { chromium } from 'playwright';

(async () => {
  // 브라우저 및 새 페이지 생성
  const browser = await chromium.launch({ headless: false }); // UI를 표시하며 브라우저 실행
  const context = await browser.newContext(); // 새 브라우저 컨텍스트 생성
  const page = await context.newPage(); // 새 페이지 생성

  // 1. 초기 URL로 이동
  const initialUrl = 'https://qa.hyperlab.hits.ai';
  console.log(`Navigating to: ${initialUrl}`);
  await page.goto(initialUrl); // 초기 URL 로드

  // 2. 리다이렉션 확인
  const redirectedUrl = page.url(); // 현재 페이지의 URL 확인
  const expectedRedirectUrl = 'https://hyperlab-qa.framer.website/'; // 예상 리다이렉션 URL
  if (redirectedUrl === expectedRedirectUrl) {
    console.log(`로그인 페이지로 리다이렉트되었습니다: ${redirectedUrl}`);
  } else {
    console.error(`리다이렉션되지 않았습니다. 현재 URL: ${redirectedUrl}`);
    await browser.close(); // 리다이렉션 실패 시 브라우저 종료
    return;
  }

  // 3. "로그인" 버튼 클릭
  const loginButton = page.locator('text=로그인'); // "로그인" 텍스트가 포함된 버튼 찾기
  if (await loginButton.count() > 0) {
    console.log('"로그인" 버튼을 찾았습니다. 클릭을 시도합니다.');
    await loginButton.click(); // 버튼 클릭
    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 }); // 탐색 대기
  } else {
    console.error('"로그인" 버튼을 찾을 수 없습니다.');
    await browser.close(); // 버튼을 찾지 못한 경우 브라우저 종료
    return;
  }

  // 4. 로그인 정보 입력
  await page.fill('input[name="email"]', 'hjh6102@hits.ai'); // 이메일 입력
  await page.fill('input[name="password"]', 'Test1234!'); // 비밀번호 입력

  // 5. 로그인 폼 제출
  const loginSubmitButton = page.locator('button:text("로그인")'); // 폼 내부 "로그인" 버튼 찾기
  if (await loginSubmitButton.count() > 0) {
    console.log('"로그인" 제출 버튼을 찾았습니다. 클릭을 시도합니다.');
    await loginSubmitButton.click(); // 로그인 버튼 클릭
    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 }); // 탐색 대기
  } else {
    console.error('"로그인" 제출 버튼을 찾을 수 없습니다.');
    await browser.close(); // 버튼을 찾지 못한 경우 브라우저 종료
    return;
  }

  // 6. OTP 페이지로 이동 확인
  const otpPageUrl = 'https://qa.hyperlab.hits.ai/lab/auth/2fa'; // OTP 페이지 URL
  const currentOtpUrl = page.url(); // 현재 페이지의 URL 확인
  if (currentOtpUrl.startsWith(otpPageUrl)) {
    console.log(`OTP 페이지로 올바르게 이동했습니다: ${currentOtpUrl}`);
  } else {
    console.error(`OTP 페이지로 이동하지 않았습니다. 현재 URL: ${currentOtpUrl}`);
    await browser.close(); // OTP 페이지가 아닌 경우 브라우저 종료
    return;
  }

  // 7. OTP 입력
  const otpFields = page.locator('input[aria-label$="field"]'); // OTP 입력 필드 찾기
  const otpValue = '000000'; // OTP 값
  for (let i = 0; i < otpValue.length; i++) {
    await otpFields.nth(i).fill(otpValue[i]); // 각 필드에 OTP 값 입력
  }
  console.log(`OTP "${otpValue}"을 입력했습니다.`);

  // 8. 프로젝트 목록 페이지 확인
  await page.waitForNavigation({ timeout: 5000 }).catch(() => {
    console.log('자동으로 다음 페이지로 이동하지 않았습니다.');
  });

  await page.waitForTimeout(5000);
  const projectPageHeader = page.locator('text=프로젝트 목록'); // 프로젝트 목록 텍스트 확인
  if (await projectPageHeader.count() > 0) {
    console.log('"프로젝트 목록" 텍스트를 확인했습니다.');
  } else {
    console.error('"프로젝트 목록" 텍스트를 찾을 수 없습니다.');
    await browser.close(); // 텍스트를 찾지 못한 경우 브라우저 종료
    return;
  }

  // 9. 브라우저 종료
  console.log('모든 작업이 완료되었습니다. 브라우저를 종료합니다.');
  await browser.close(); // 브라우저 종료
})();