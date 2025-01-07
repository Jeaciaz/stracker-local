import {createSignal, Show, type Component} from 'solid-js'
import {Track} from './pages/Track'
import {Spendings} from './pages/Spendings'
import {enableSync} from './sync-events'

type Tab = 'track' | 'spendings'

const App: Component = () => {
  const [tab, setTab] = createSignal<Tab>('track')
  const [isSyncing, setIsSyncing] = createSignal(false)

  const enableSyncWithLoading = () => {
    setIsSyncing(true)
    enableSync()
      .catch(e => {
        alert('Could not sync properly :(')
      })
      .finally(() => setIsSyncing(false))
  }

  return (
    <div class="p-4 min-h-svh flex flex-col gap-6 relative">
      <h1 class="text-4xl">Track your ₪</h1>
      <button class="button" onClick={enableSyncWithLoading}>
        Enable sync
      </button>
      <div role="tablist" class="tabs tabs-bordered">
        <button
          role="tab"
          classList={{tab: true, 'tab-active': tab() === 'track'}}
          onPointerDown={() => setTab('track')}
        >
          Track
        </button>
        <button
          role="tab"
          classList={{tab: true, 'tab-active': tab() === 'spendings'}}
          onPointerDown={() => setTab('spendings')}
        >
          Spendings
        </button>
      </div>
      {
        {
          track: <Track />,
          spendings: <Spendings />,
        }[tab()]
      }
      <Show when={isSyncing()}>
        <div class="flex justify-center items-center fixed inset-0 bg-black/50 z-10">
          <div class="loading loading-bars loading-lg" />
        </div>
      </Show>
    </div>
  )
}

export default App
