import { createSignal, type Component } from 'solid-js';
import { Track } from './pages/Track';
import { Spendings } from './pages/Spendings';

type Tab = 'track' | 'spendings';

const App: Component = () => {
  const [tab, setTab] = createSignal<Tab>('track')

  return (
    <div class="p-4 min-h-svh flex flex-col gap-6">
      <h1 class="text-4xl" onClick={() => prompt(JSON.stringify(localStorage))}>Track your ₪</h1>
      <div role="tablist" class="tabs tabs-bordered">
        <button role="tab" classList={{ tab: true, 'tab-active': tab() === 'track' }} onPointerDown={() => setTab('track')}>Track</button>
        <button role="tab" classList={{ tab: true, 'tab-active': tab() === 'spendings' }} onPointerDown={() => setTab('spendings')}>Spendings</button>
      </div>
      {{
        track: <Track />,
        spendings: <Spendings />,
      }[tab()]}
    </div>
  );
};

export default App;
