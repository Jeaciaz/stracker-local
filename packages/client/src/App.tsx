import {createSignal, Show, type Component} from 'solid-js'
import {Track} from './pages/Track'
import {Spendings} from './pages/Spendings'
import {
  enableSync,
  forceResync,
  isSyncing,
  syncCredentials,
} from './sync-events'

type Tab = 'track' | 'spendings'

const App: Component = () => {
  let tabsContainerRef!: HTMLDivElement
  const [tab, setTabSignal] = createSignal<Tab>('track')

  const forceResyncWithConfirm = () => {
    if (
      !confirm(
        'Are you sure you want to delete all locally stored data and restore it from the server?',
      )
    ) {
      return
    }

    forceResync()
  }

  const setTab = (tab: Tab) => {
    tabsContainerRef.scrollTo({
      top: 0,
      left: {track: 0, spendings: tabsContainerRef.scrollWidth / 2}[tab],
      behavior: 'smooth',
    })
  }

  const updateTabSignal = () => {
    const tabs = ['track', 'spendings'] as const
    const t =
      tabsContainerRef.scrollLeft /
      (tabsContainerRef.scrollWidth - tabsContainerRef.clientWidth)
    setTabSignal(tabs[Math.round(t)])
  }

  return (
    <div
      class="p-4 min-h-svh flex flex-col gap-6 relative"
      classList={{'overflow-y-hidden': tab() === 'track'}}
    >
      <div class="flex justify-between">
        <h1 class="text-4xl">Track your ₪</h1>
        <Show
          when={!syncCredentials()}
          fallback={
            <button
              class="btn btn-outline btn-xs"
              onClick={forceResyncWithConfirm}
            >
              Force reset
            </button>
          }
        >
          <button class="btn btn-outline btn-xs" onClick={enableSync}>
            Enable sync
          </button>
        </Show>
      </div>
      <div role="tablist" class="tabs tabs-bordered">
        <button
          role="tab"
          classList={{tab: true, 'tab-active': tab() === 'track'}}
          onClick={() => setTab('track')}
        >
          Track
        </button>
        <button
          role="tab"
          classList={{tab: true, 'tab-active': tab() === 'spendings'}}
          onClick={() => setTab('spendings')}
        >
          Spendings
        </button>
      </div>
      <div
        class="flex overflow-x-auto snap-mandatory snap-x mx-2 gap-6 grow basis-0"
        onScroll={updateTabSignal}
        ref={tabsContainerRef}
      >
        <div class="w-full shrink-0 snap-start overflow-y-auto overflow-x-hidden">
          <Track />
        </div>
        <div class="w-full shrink-0 snap-start overflow-y-auto overflow-x-hidden">
          <Spendings />
        </div>
      </div>
      <Show when={isSyncing()}>
        <div class="flex justify-center items-center fixed inset-0 bg-black/50 z-10">
          <div class="loading loading-bars loading-lg" />
        </div>
      </Show>
    </div>
  )
}

export default App
