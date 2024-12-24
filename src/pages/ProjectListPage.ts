import { Page } from 'playwright';

export class ProjectListPage {
    private page: Page;
    
    constructor(page: Page) {
        this.page = page;
    }

    async verifyProjectListPage() {
        await this.page.waitForTimeout(5000);
        const projectPageHeader = this.page.locator('text=프로젝트 목록');
        if (await projectPageHeader.count() === 0) {
            throw new Error('Project list page not found');
        }
    }

    async createNewProject(projectName: string) {
        // 프로젝트 생성 관련 메서드 구현
        // TODO: 구현 필요
    }
}