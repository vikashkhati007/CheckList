import React from 'react'
import Head from 'next/head'
import TodoComponents from '../components/TodoComponent'

export default function HomePage() {
  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-tailwindcss)</title>
      </Head>
      <TodoComponents/>
    </React.Fragment>
  )
}
