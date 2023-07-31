import '@/styles/globals.css'
import { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <div className='h-full max-w-5xl mx-auto pt-10'>
      <Component {...pageProps} />
    </div>
  )
}
