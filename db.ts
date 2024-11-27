import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('todo.db');

export interface Todo {
  id: number;
  task: string;
  done: number;
}

export async function createTable() {
  try {
    await db.runAsync(
      'CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT, done INTEGER);'
    );
  } catch (error) {}
}

export async function insertTodo(task: string) {
  try {
    await db.runAsync('INSERT INTO todos (task, done) VALUES (?, ?)', [
      task,
      0,
    ]);
  } catch (error) {}
}

export async function getTodos() {
  try {
    const result = await db.getAllAsync<Todo>(
      'SELECT * FROM todos order by done, task'
    );
    return result;
  } catch (error) {
    return [];
  }
}

export async function toggleTodo(id: number, done: number) {
  try {
    await db.runAsync('UPDATE todos SET done = ? WHERE id = ?', [
      done === 0 ? 1 : 0,
      id,
    ]);
  } catch (error) {}
}

export async function deleteTodo(id: number) {
  try {
    await db.runAsync('DELETE FROM todos WHERE id = ?', [id]);
  } catch (error) {}
}
