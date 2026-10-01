import { test, expect } from '@playwright/test';

function getRandomPrefix() {
  return `test-${Math.random().toString(36).substring(2, 10)}`;
}

test.describe('Filter Todos', () => {
  let prefix: string;
  
  test.beforeEach(async ({ page }) => {
    prefix = getRandomPrefix();
    await page.goto('https://demo.playwright.dev/todomvc/#/');
  });

  test('should filter by active todos', async ({ page }) => {
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

    // Mark one as completed
    await page.getByRole('listitem').filter({ hasText: prefix }).first().getByRole('checkbox').click();

    // Click 'Active' filter
    await page.getByRole('link', { name: 'Active' }).click();

    const items = page.getByRole('listitem').filter({ hasText: prefix });

    // Verify only active todos are visible
    await expect(items).toHaveCount(2);
    await expect(items.nth(0)).toContainText(todo2);
    await expect(items.nth(1)).toContainText(todo3);
  });

  test('should filter by completed todos', async ({ page }) => {
    const todo1 = `${prefix}-Task 1`;
    const todo2 = `${prefix}-Task 2`;

    // Add two todos
    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(todo1);
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');

    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(todo2);
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');

    // Mark one as completed
    await page.getByRole('listitem').filter({ hasText: prefix }).first().getByRole('checkbox').click();

    // Click 'Completed' filter
    await page.getByRole('link', { name: 'Completed' }).click();

    const items = page.getByRole('listitem').filter({ hasText: prefix });

    // Verify only completed todos are visible
    await expect(items).toHaveCount(1);
    await expect(items.first()).toContainText(todo1);
    await expect(items.first()).toHaveClass(/completed/);
  });

  test('should filter by all todos', async ({ page }) => {
    const todo1 = `${prefix}-Task 1`;
    const todo2 = `${prefix}-Task 2`;

    // Add two todos
    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(todo1);
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');

    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(todo2);
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');

    // Mark one as completed
    await page.getByRole('listitem').filter({ hasText: prefix }).first().getByRole('checkbox').click();

    // Click 'All' filter
    await page.getByRole('link', { name: 'All' }).click();

    const items = page.getByRole('listitem').filter({ hasText: prefix });

    // Verify all todos are visible
    await expect(items).toHaveCount(2);
  });
});
