import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

interface Todo {
  id: number
  text: string
  completed: boolean
}

export default function TodoComponents() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos')
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos))
    }
  }, [])

  const saveTodos = (updatedTodos: Todo[]) => {
    localStorage.setItem('todos', JSON.stringify(updatedTodos))
  }

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodo.trim() !== '') {
      const updatedTodos = [...todos, { id: Date.now(), text: newTodo, completed: false }]
      setTodos(updatedTodos)
      saveTodos(updatedTodos)
      setNewTodo('')
    }
  }

  const toggleTodo = (id: number) => {
    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
    setTodos(updatedTodos)
    saveTodos(updatedTodos)
  }

  const deleteTodo = (id: number) => {
    const updatedTodos = todos.filter(todo => todo.id !== id)
    setTodos(updatedTodos)
    saveTodos(updatedTodos)
  }

  return (
    <React.Fragment>
      <Head>
        <title>Todo App</title>
      </Head>
      <div className={`todo-container ${inter.className}`}>
        <div className="todo-card">
          <div className="todo-content">
            <h1 className="todo-title">Add Your Todos</h1>
            <form onSubmit={addTodo} className="todo-form">
              <div className="todo-input-container">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Add a new task"
                  className="todo-input"
                />
                <button
                  type="submit"
                  className="todo-submit"
                >
                  Add Task
                </button>
              </div>
            </form>
            <ul className="todo-list">
              {todos.map(todo => (
                <li key={todo.id} className="todo-item">
                  <div>
                    <input
                      type="checkbox"
                      id={`todo-${todo.id}`}
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="todo-checkbox"
                    />
                    <label
                      htmlFor={`todo-${todo.id}`}
                      className={`todo-label ${todo.completed ? 'todo-completed' : ''}`}
                    >
                      {todo.text}
                    </label>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="todo-delete"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}