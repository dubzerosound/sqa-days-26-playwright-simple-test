import { test, expect } from '@playwright/test';

function getRandomPrefix() {
  return `test-${Math.random().toString(36).substring(2, 10)}`;
}

test.describe('Edit Todos', () => {
  let prefix: string;
  
  test.beforeEach(async ({ page }) => {
    prefix = getRandomPrefix();
    await page.goto('https://demo.playwright.dev/todomvc/#/');
  });

  test('should edit a todo item', async ({ page }) => {
    const originalText = `${prefix}-Original text`;
    const newText = `${prefix}-Edited text`;

    // Add a todo
    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(originalText);
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');

    // Verify the todo is visible
    await expect(page.getByRole('listitem').filter({ hasText: prefix }).first()).toContainText(originalText);

    // Double-click to edit
    await page.getByRole('listitem').filter({ hasText: prefix }).first().dblclick();

    // Type new text - clear and type
    const editInput = page.getByRole('listitem').filter({ hasText: prefix }).first().getByRole('textbox');
    await editInput.press('Control+A');
    await editInput.press('Backspace');
    await editInput.type(newText);
    await editInput.press('Enter');

    // Verify the todo text is updated
    await expect(page.getByRole('listitem').filter({ hasText: prefix }).first()).toContainText(newText);
  });

  test('should save edits on blur', async ({ page }) => {
    const originalText = `${prefix}-Original text`;
    const newText = `${prefix}-Edited on blur`;

    // Add a todo
    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(originalText);
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');

    // Double-click to edit
    await page.getByRole('listitem').filter({ hasText: prefix }).first().dblclick();

    // Type new text
    const editInput = page.getByRole('listitem').filter({ hasText: prefix }).first().getByRole('textbox');
    await editInput.press('Control+A');
    await editInput.press('Backspace');
    await editInput.type(newText);

    // Click outside to trigger blur
    await page.getByRole('heading', { name: 'todos' }).click();

    // Verify the todo text is updated
    await expect(page.getByRole('listitem').filter({ hasText: prefix }).first()).toContainText(newText);
  });

  test('should remove empty edits', async ({ page }) => {
    const todoText = `${prefix}-Task to delete`;

    // Add a todo
    await page.getByRole('textbox', { name: 'What needs to be done?' }).fill(todoText);
    await page.getByRole('textbox', { name: 'What needs to be done?' }).press('Enter');

    // Double-click to edit
    await page.getByRole('listitem').filter({ hasText: prefix }).first().dblclick();

    // Clear the text and press Enter
    const editInput = page.getByRole('listitem').filter({ hasText: prefix }).first().getByRole('textbox');
    await editInput.press('Control+A');
    await editInput.press('Backspace');
    await editInput.press('Enter');

    // Verify the todo is removed
    await expect(page.getByRole('listitem').filter({ hasText: prefix })).toHaveCount(0);
  });
});
