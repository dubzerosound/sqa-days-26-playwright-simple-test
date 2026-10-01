import { test, expect } from '@playwright/test';

function getRandomPrefix() {
  return `test-${Math.random().toString(36).substring(2, 10)}`;
}

test.describe('Complete Todos', () => {
  let prefix: string;
  
  test.beforeEach(async ({ page }) => {
    prefix = getRandomPrefix();
    await page.goto('https://demo.playwright.dev/todomvc/#/');
  });

  test('should mark a todo as complete', async ({ page }) => {
    const todo = `${prefix}-Learn Playwright`;
    
    // Add a todo
    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(todo);
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');

    // Verify todo is visible
    await expect(page.getByRole('listitem').filter({ hasText: prefix }).first()).toContainText(todo);

    // Click the checkbox to mark as complete
    await page.getByRole('listitem').filter({ hasText: prefix }).first().getByRole('checkbox').click();

    // Verify the todo is marked as completed
    await expect(page.getByRole('listitem').filter({ hasText: prefix }).first()).toHaveClass(/completed/);
  });

  test('should mark all todos as complete', async ({ page }) => {
    const todo1 = `${prefix}-Task 1`;
    const todo2 = `${prefix}-Task 2`;
    const todo3 = `${prefix}-Task 3`;

    // Add three todos
    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(todo1);
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');

    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(todo2);
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');

    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(todo3);
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');

    // Verify all three todos are visible
    const items = page.getByRole('listitem').filter({ hasText: prefix });
    await expect(items).toHaveCount(3);

    // Click the 'Toggle all' checkbox
    await page.getByRole('checkbox', { name: 'Mark all as complete' }).click();

    // Verify all todos are marked as completed
    await expect(items.nth(0)).toHaveClass(/completed/);
    await expect(items.nth(1)).toHaveClass(/completed/);
    await expect(items.nth(2)).toHaveClass(/completed/);

    // Click the 'Toggle all' checkbox again
    await page.getByRole('checkbox', { name: 'Mark all as complete' }).click();

    // Verify all todos are marked as active
    await expect(items.nth(0)).not.toHaveClass(/completed/);
    await expect(items.nth(1)).not.toHaveClass(/completed/);
    await expect(items.nth(2)).not.toHaveClass(/completed/);
  });

  test('should clear completed todos', async ({ page }) => {
    const todo1 = `${prefix}-Task 1`;
    const todo2 = `${prefix}-Task 2`;

    // Add two todos
    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(todo1);
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');

    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(todo2);
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');

    // Mark one as completed
    await page.getByRole('listitem').filter({ hasText: prefix }).first().getByRole('checkbox').click();

    const items = page.getByRole('listitem').filter({ hasText: prefix });

    // Verify two todos are visible, one completed
    await expect(items).toHaveCount(2);
    await expect(items.first()).toHaveClass(/completed/);

    // Click 'Clear completed' button
    await page.getByRole('button', { name: 'Clear completed' }).click();

    // Verify only the active todo remains
    await expect(items).toHaveCount(1);
    await expect(items.first()).toContainText(todo2);
    await expect(items.first()).not.toHaveClass(/completed/);
  });
});
