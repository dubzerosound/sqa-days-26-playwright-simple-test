import { test, expect } from './fixtures/todo.fixture';

test.describe('TodoMVC', () => {
  test('starts with an empty list and focused input', async ({ todoPage }) => {
    await expect(todoPage.todoList).toBeHidden();
    await expect(todoPage.newTodo).toBeFocused();
  });

  test('adds a single todo', async ({ todoPage }) => {
    await todoPage.addTodo('Buy milk');

    await expect(todoPage.todoItem('Buy milk')).toBeVisible();
    await expect(todoPage.todoCount).toHaveText('1 item left');
    await expect(todoPage.newTodo).toHaveValue('');
  });

  test('adds multiple todos and updates the counter', async ({ todoPage }) => {
    await todoPage.addTodos(['First task', 'Second task', 'Third task']);

    await expect(todoPage.todoList.getByRole('listitem')).toHaveCount(3);
    await expect(todoPage.todoCount).toHaveText('3 items left');
  });

  test('ignores blank submissions', async ({ todoPage }) => {
    await todoPage.newTodo.press('Enter');
    await todoPage.addTodo('   ');
    await todoPage.newTodo.press('Enter');

    await expect(todoPage.todoList).toBeHidden();
  });

  test('marks a todo as completed', async ({ todoPage }) => {
    await todoPage.addTodo('Walk the dog');
    await todoPage.toggleTodo('Walk the dog');

    await expect(todoPage.todoItem('Walk the dog')).toHaveClass(/completed/);
    await expect(todoPage.todoCount).toHaveText('0 items left');
  });

  test('filters active and completed todos', async ({ todoPage }) => {
    await todoPage.addTodos(['Active one', 'Done one']);
    await todoPage.toggleTodo('Done one');

    await todoPage.filter('Active').click();
    await expect(todoPage.todoList.getByRole('listitem')).toHaveCount(1);
    await expect(todoPage.todoItem('Active one')).toBeVisible();
    await expect(todoPage.todoItem('Done one')).toBeHidden();

    await todoPage.filter('Completed').click();
    await expect(todoPage.todoList.getByRole('listitem')).toHaveCount(1);
    await expect(todoPage.todoItem('Done one')).toBeVisible();

    await todoPage.filter('All').click();
    await expect(todoPage.todoList.getByRole('listitem')).toHaveCount(2);
  });

  test('edits a todo inline', async ({ todoPage }) => {
    await todoPage.addTodo('Learn Playwright');
    await todoPage.editTodo('Learn Playwright', 'Master Playwright');

    await expect(todoPage.todoItem('Master Playwright')).toBeVisible();
    await expect(todoPage.todoItem('Learn Playwright')).toHaveCount(0);
  });

  test('deletes a todo', async ({ todoPage }) => {
    await todoPage.addTodos(['Keep me', 'Remove me']);
    await todoPage.deleteTodo('Remove me');

    await expect(todoPage.todoItem('Remove me')).toHaveCount(0);
    await expect(todoPage.todoItem('Keep me')).toBeVisible();
    await expect(todoPage.todoCount).toHaveText('1 item left');
  });

  test('marks all todos complete and clears completed', async ({ todoPage }) => {
    await todoPage.addTodos(['A', 'B', 'C']);
    await todoPage.markAllComplete.click();

    await expect(todoPage.todoCount).toHaveText('0 items left');
    await expect(todoPage.todoList.locator('li.completed')).toHaveCount(3);

    await todoPage.clearCompleted.click();
    await expect(todoPage.todoList).toBeHidden();
  });

  test('persists todos in localStorage after reload', async ({ page, todoPage }) => {
    await todoPage.addTodos(['Persist me', 'And me']);

    await page.reload();
    await expect(todoPage.todoItem('Persist me')).toBeVisible();
    await expect(todoPage.todoItem('And me')).toBeVisible();
    await expect(todoPage.todoCount).toHaveText('2 items left');
  });
});
