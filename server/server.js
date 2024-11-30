const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');  // Импортируем cors

const app = express();
const port = 5000; 

// Разрешаем запросы с любых доменов
app.use(cors());

// Мидлвар для парсинга JSON тела запроса
app.use(express.json());

// Путь к файлу с задачами
const todosFilePath = path.join(__dirname, 'todos.json');

// Получение всех задач
app.get('/todos', (req, res) => {
  fs.readFile(todosFilePath, 'utf-8', (err, data) => {
    if (err) {
      console.error("Error reading the file:", err); // Логируем ошибку
      return res.status(500).json({ error: 'Error reading the file' });
    }
    try {
      res.json(JSON.parse(data));
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError); // Логируем ошибку парсинга
      res.status(500).json({ error: 'Error parsing JSON' });
    }
  });
});

// Добавление новой задачи
app.post('/todos', (req, res) => {
  const newTodo = req.body;

  fs.readFile(todosFilePath, 'utf-8', (err, data) => {
    if (err) {
      console.error("Error reading the file:", err); // Логируем ошибку
      return res.status(500).json({ error: 'Error reading the file' });
    }

    let todos = [];
    try {
      todos = JSON.parse(data); // Пробуем распарсить JSON
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError); // Логируем ошибку парсинга
      return res.status(500).json({ error: 'Error parsing JSON' });
    }

    todos.push(newTodo);

    fs.writeFile(todosFilePath, JSON.stringify(todos, null, 2), 'utf-8', (err) => {
      if (err) {
        console.error("Error writing to the file:", err); // Логируем ошибку
        return res.status(500).json({ error: 'Error writing to the file' });
      }
      res.status(201).json(newTodo);
    });
  });
});

// Обновление задачи
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const updatedTodo = req.body;

  fs.readFile(todosFilePath, 'utf-8', (err, data) => {
    if (err) {
      console.error("Error reading the file:", err); // Логируем ошибку
      return res.status(500).json({ error: 'Error reading the file' });
    }

    let todos = [];
    try {
      todos = JSON.parse(data); // Пробуем распарсить JSON
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError); // Логируем ошибку парсинга
      return res.status(500).json({ error: 'Error parsing JSON' });
    }

    const todoIndex = todos.findIndex((todo) => todo.id === parseInt(id));

    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    todos[todoIndex] = { ...todos[todoIndex], ...updatedTodo };

    fs.writeFile(todosFilePath, JSON.stringify(todos, null, 2), 'utf-8', (err) => {
      if (err) {
        console.error("Error writing to the file:", err); // Логируем ошибку
        return res.status(500).json({ error: 'Error writing to the file' });
      }
      res.json(todos[todoIndex]);
    });
  });
});

// Удаление задачи
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;

  fs.readFile(todosFilePath, 'utf-8', (err, data) => {
    if (err) {
      console.error("Error reading the file:", err); // Логируем ошибку
      return res.status(500).json({ error: 'Error reading the file' });
    }

    let todos = [];
    try {
      todos = JSON.parse(data); // Пробуем распарсить JSON
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError); // Логируем ошибку парсинга
      return res.status(500).json({ error: 'Error parsing JSON' });
    }

    todos = todos.filter((todo) => todo.id !== parseInt(id));

    fs.writeFile(todosFilePath, JSON.stringify(todos, null, 2), 'utf-8', (err) => {
      if (err) {
        console.error("Error writing to the file:", err); // Логируем ошибку
        return res.status(500).json({ error: 'Error writing to the file' });
      }
      res.status(204).send();
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
