import React from 'react'
import Head from 'next/head'
import TodoApp from '../components/TodoComponent'

export default function HomePage() {
  return (
    <React.Fragment>
      <Head>
        <title>Todo App</title>
      </Head>
      <TodoApp/>
    </React.Fragment>
  )
}
