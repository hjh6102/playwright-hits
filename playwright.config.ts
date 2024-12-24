import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src', // 테스트 파일 디렉터리
  timeout: 30000,
  retries: 1,
  use: {
    headless: false, // 브라우저 UI를 표시하며 실행
  },
  reporter: [['html', { outputFolder: 'playwright-report', open: 'on-failure' }]]
});