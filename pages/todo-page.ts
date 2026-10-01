import { type Locator, type Page, expect } from '@playwright/test';

export class TodoPage {
  readonly page: Page;
  readonly newTodo: Locator;
  readonly todoList: Locator;
  readonly todoCount: Locator;
  readonly markAllComplete: Locator;
  readonly clearCompleted: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newTodo = page.getByRole('textbox', { name: 'What needs to be done?' });
    this.todoList = page.locator('.todo-list');
    this.todoCount = page.locator('.todo-count');
    this.markAllComplete = page.getByRole('checkbox', { name: 'Mark all as complete' });
    this.clearCompleted = page.getByRole('button', { name: 'Clear completed' });
  }

  async open(): Promise<void> {
    await this.page.goto('/todomvc');
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
    await expect(this.newTodo).toBeVisible();
  }

  todoItem(title: string): Locator {
    return this.todoList.getByRole('listitem').filter({ hasText: title });
  }

  async addTodo(title: string): Promise<void> {
    await this.newTodo.fill(title);
    await this.newTodo.press('Enter');
  }

  async addTodos(titles: string[]): Promise<void> {
    for (const title of titles) {
      await this.addTodo(title);
    }
  }

  filter(name: 'All' | 'Active' | 'Completed'): Locator {
    return this.page.getByRole('link', { name: name, exact: true });
  }

  async toggleTodo(title: string): Promise<void> {
    await this.todoItem(title).getByRole('checkbox', { name: 'Toggle Todo' }).click();
  }

  async deleteTodo(title: string): Promise<void> {
    const item = this.todoItem(title);
    await item.hover();
    await item.locator('.destroy').click();
  }

  async editTodo(title: string, newTitle: string): Promise<void> {
    const label = this.todoItem(title).locator('label');
    await label.dblclick();
    const editInput = this.todoItem(title).locator('.edit');
    await editInput.fill(newTitle);
    await editInput.press('Enter');
  }
}
