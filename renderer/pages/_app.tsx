import { ThemeProvider } from 'components/theme-provider'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { myFont } from 'lib/fonts'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <main className={myFont.className}>
    <Component {...pageProps} /> 
    </main>   
    </ThemeProvider>
  )
}

export default MyApp