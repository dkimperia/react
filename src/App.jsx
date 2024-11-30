import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import AddTodoForm from './components/AddTodoForm';
import './App.css';

const App = () => {
  const [todos, setTodos] = useState([]);

  // Загружаем задачи с сервера
  useEffect(() => {
    fetch('http://localhost:5000/todos')
      .then((res) => res.json())
      .then((data) => setTodos(data));
  }, []);

  // Добавляем задачу на сервер
  const addTodo = (text) => {
    const newTodo = { id: Date.now(), text, completed: false };

    fetch('http://localhost:5000/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo),
    })
      .then((res) => res.json())
      .then((addedTodo) => {
        setTodos([...todos, addedTodo]);
      });
  };

  // Обновляем задачу на сервере (например, изменяем статус на выполненную)
  const toggleTodo = (id) => {
    const todoToUpdate = todos.find((todo) => todo.id === id);
    const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };

    fetch(`http://localhost:5000/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTodo),
    })
      .then((res) => res.json())
      .then((updated) => {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, completed: updated.completed } : todo
          )
        );
      });
  };

  // Удаляем задачу на сервере
  const deleteTodo = (id) => {
    fetch(`http://localhost:5000/todos/${id}`, { method: 'DELETE' })
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      });
  };

  return (
    <div className="app">
      <h1>To-Do List</h1>
      <AddTodoForm addTodo={addTodo} />
      <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
    </div>
  );
};

export default App;
