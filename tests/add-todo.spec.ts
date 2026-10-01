import { test, expect } from '@playwright/test';

function getRandomPrefix() {
  return `test-${Math.random().toString(36).substring(2, 10)}`;
}

test.describe('Add Todos', () => {
  let prefix: string;
  
  test.beforeEach(async ({ page }) => {
    prefix = getRandomPrefix();
    await page.goto('https://demo.playwright.dev/todomvc/#/');
  });

  test('should add a new todo item', async ({ page }) => {
    const todo1 = `${prefix}-Learn Playwright`;
    const todo2 = `${prefix}-Test automation`;
    
    // Type first todo and press Enter
    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(todo1);
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');

    // Verify the first todo appears in the list
    await expect(page.getByRole('listitem').filter({ hasText: prefix }).first()).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: prefix }).first()).toContainText(todo1);

    // Verify input field is cleared
    await expect(page.getByRole('textbox', { name: 'What needs to be done?' })).toBeEmpty();

    // Type second todo and press Enter
    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(todo2);
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');

    // Verify both todos are visible
    const items = page.getByRole('listitem').filter({ hasText: prefix });
    await expect(items).toHaveCount(2);
    await expect(items.nth(0)).toContainText(todo1);
    await expect(items.nth(1)).toContainText(todo2);
  });

  test('should add multiple todo items', async ({ page }) => {
    const todo1 = `${prefix}-Buy groceries`;
    const todo2 = `${prefix}-Write code`;
    const todo3 = `${prefix}-Go for a walk`;

    // Add first todo
    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(todo1);
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
    await expect(page.getByRole('listitem').filter({ hasText: prefix }).first()).toContainText(todo1);

    // Add second todo
    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(todo2);
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');
    await expect(page.getByRole('listitem').filter({ hasText: prefix }).nth(1)).toContainText(todo2);

    // Add third todo
    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(todo3);
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');

    // Verify all three todos are visible
    const items = page.getByRole('listitem').filter({ hasText: prefix });
    await expect(items).toHaveCount(3);
    await expect(items.nth(0)).toContainText(todo1);
    await expect(items.nth(1)).toContainText(todo2);
    await expect(items.nth(2)).toContainText(todo3);
  });

  test('should reject empty todo items', async ({ page }) => {
    const initialCount = await page.getByRole('listitem').filter({ hasText: prefix }).count();

    // Press Enter without typing anything
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');

    // Verify no new todo was added
    await expect(page.getByRole('listitem').filter({ hasText: prefix })).toHaveCount(initialCount);
  });
});
