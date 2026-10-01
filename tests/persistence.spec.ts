import { test, expect } from '@playwright/test';

function getRandomPrefix() {
  return `test-${Math.random().toString(36).substring(2, 10)}`;
}

test.describe('Persistence', () => {
  let prefix: string;
  
  test.beforeEach(async ({ page }) => {
    prefix = getRandomPrefix();
    await page.goto('https://demo.playwright.dev/todomvc/#/');
  });

  test('should persist completed state', async ({ page }) => {
    const todo = `${prefix}-Persistent task`;
    
    // Add a todo and mark it as completed
    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(todo);
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
    await page.getByRole('listitem').filter({ hasText: prefix }).first().getByRole('checkbox').click();

    // Verify it's completed
    await expect(page.getByRole('listitem').filter({ hasText: prefix }).first()).toHaveClass(/completed/);

    // Reload the page
    await page.reload();

    // Navigate back to the app
    await page.goto('https://demo.playwright.dev/todomvc/#/');

    // Verify the todo is still there and completed
    await expect(page.getByRole('listitem').filter({ hasText: prefix }).first()).toContainText(todo);
    await expect(page.getByRole('listitem').filter({ hasText: prefix }).first()).toHaveClass(/completed/);
  });

  test('should persist all todos', async ({ page }) => {
    const todo1 = `${prefix}-Todo 1`;
    const todo2 = `${prefix}-Todo 2`;
    const todo3 = `${prefix}-Todo 3`;

    // Add multiple todos
    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(todo1);
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');

    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(todo2);
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');

    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(todo3);
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');

    // Mark the first one as completed
    await page.getByRole('listitem').filter({ hasText: prefix }).first().getByRole('checkbox').click();

    const items = page.getByRole('listitem').filter({ hasText: prefix });

    // Reload the page
    await page.reload();

    // Navigate back to the app
    await page.goto('https://demo.playwright.dev/todomvc/#/');

    // Verify all todos are still there
    await expect(items).toHaveCount(3);
    await expect(items.nth(0)).toContainText(todo1);
    await expect(items.nth(0)).toHaveClass(/completed/);
    await expect(items.nth(1)).toContainText(todo2);
    await expect(items.nth(2)).toContainText(todo3);
  });
});
