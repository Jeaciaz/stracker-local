import {createSignal, Show, type Component} from 'solid-js'
import {Track} from './pages/Track'
import {Spendings} from './pages/Spendings'
import {enableSync, isSyncing, syncCredentials} from './sync-events'

type Tab = 'track' | 'spendings'

const App: Component = () => {
  const [tab, setTab] = createSignal<Tab>('track')

  return (
    <div class="p-4 min-h-svh flex flex-col gap-6 relative">
      <div class="flex justify-between">
        <h1
          class="text-4xl"
          onClick={() => {
            const strLS = prompt('Enter local storage:')
            if (!strLS) return
            try {
              Object.entries(JSON.parse(strLS)).forEach(([key, value]) => {
                localStorage.setItem(key, String(value))
              })
            } catch {
              alert('failed')
            }
          }}
        >
          Track your ₪
        </h1>
        <Show when={!syncCredentials()}>
          <button class="btn btn-outline btn-xs" onClick={enableSync}>
            Enable sync
          </button>
        </Show>
      </div>
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
