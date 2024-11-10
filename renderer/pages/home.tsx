import React from 'react'
import Head from 'next/head'
import TodoComponents from '../components/TodoComponent'
// Define your font configuration
export default function HomePage() {
  return (
    <React.Fragment>
      <Head>
        <title>Todo App - By @vikashkhati007</title>
      </Head>
      <TodoComponents/>
    </React.Fragment>
  )
}
