import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { Inter } from 'next/font/google'
import { ipcRenderer } from 'electron'

const inter = Inter({ subsets: ['latin'] })

interface Todo {
  id: number
  text: string
  completed: boolean
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState('')

  useEffect(() => {
    // Load todos from electron store on component mount
    ipcRenderer.send('load-todos')
    ipcRenderer.on('todos-loaded', (_, loadedTodos) => {
      setTodos(loadedTodos)
    })

    return () => {
      ipcRenderer.removeAllListeners('todos-loaded')
    }
  }, [])

  const saveTodos = (updatedTodos: Todo[]) => {
    ipcRenderer.send('save-todos', updatedTodos)
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
        <title>Professional Todo App</title>
      </Head>
      <div className={`min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 py-12 px-4 ${inter.className}`}>
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8">Professional Todo App</h1>
            <form onSubmit={addTodo} className="mb-6">
              <div className="flex items-center border-b-2 border-indigo-500 py-2">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Add a new task"
                  className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                />
                <button
                  type="submit"
                  className="flex-shrink-0 bg-indigo-500 hover:bg-indigo-600 border-indigo-500 hover:border-indigo-600 text-sm border-4 text-white py-1 px-4 rounded-full transition duration-150 ease-in-out"
                >
                  Add Task
                </button>
              </div>
            </form>
            <ul className="divide-y divide-gray-200">
              {todos.map(todo => (
                <li key={todo.id} className="py-4 flex items-center justify-between group">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`todo-${todo.id}`}
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`todo-${todo.id}`}
                      className={`ml-3 block text-sm font-medium ${
                        todo.completed ? 'text-gray-400 line-through' : 'text-gray-700'
                      }`}
                    >
                      {todo.text}
                    </label>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="ml-2 text-sm font-medium text-red-500 hover:text-red-600 transition duration-150 ease-in-out opacity-0 group-hover:opacity-100"
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