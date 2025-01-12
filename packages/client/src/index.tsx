/* @refresh reload */
import {ErrorBoundary, render} from 'solid-js/web'

import './index.css'
import App from './App'

const root = document.getElementById('root')

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  )
}

render(
  () => (
    <ErrorBoundary
      fallback={e => {
        const strE = e instanceof Error ? String(e) : JSON.stringify(e)
        alert(strE)
        return (
          <>
            <div>{strE}</div>
            <div>LS:</div>
            <pre>{JSON.stringify(localStorage, null, 2)}</pre>
          </>
        )
      }}
    >
      <App />
    </ErrorBoundary>
  ),
  root!,
)
