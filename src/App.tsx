import { createSignal, type Component } from 'solid-js';
import { Track } from './pages/Track';
import { Spendings } from './pages/Spendings';

type Tab = 'track' | 'spendings';

const App: Component = () => {
  const [tab, setTab] = createSignal<Tab>('track')
  return (
    <div class="p-4 min-h-svh flex flex-col gap-6">
      <button class="button" onClick={() => {
        localStorage.setItem('spendings',
        `[{"category":"medical","amount":443.25,"datetime":1687903020000},{"category":"medical","amount":326.34,"datetime":1687884480000},{"category":"medical","amount":231.07,"datetime":1687500900000},{"category":"medical","amount":207.66,"datetime":1687328400000},{"category":"medical","amount":86.84,"datetime":1686532260000},{"category":"medical","amount":271.69,"datetime":1686226140000},{"category":"medical","amount":11.07,"datetime":1685849880000},{"category":"medical","amount":71.67,"datetime":1685819820000},{"category":"medical","amount":109.85,"datetime":1684297140000},{"category":"medical","amount":493.83,"datetime":1684082160000},{"category":"medical","amount":421.06,"datetime":1683524340000},{"category":"medical","amount":135.14,"datetime":1683460740000},{"category":"medical","amount":11.23,"datetime":1683090660000},{"category":"medical","amount":271.37,"datetime":1682592000000},{"category":"medical","amount":466.47,"datetime":1682031840000},{"category":"medical","amount":466.13,"datetime":1681400820000},{"category":"medical","amount":438,"datetime":1681230180000},{"category":"medical","amount":454.97,"datetime":1680905940000},{"category":"medical","amount":409.59,"datetime":1680331260000},{"category":"medical","amount":376.2,"datetime":1678072440000},{"category":"medical","amount":237.54,"datetime":1677974340000},{"category":"medical","amount":398.01,"datetime":1677526920000},{"category":"medical","amount":332.25,"datetime":1677117900000},{"category":"medical","amount":45.07,"datetime":1676081880000},{"category":"medical","amount":112.78,"datetime":1675761060000},{"category":"medical","amount":316.97,"datetime":1675563960000},{"category":"medical","amount":153.76,"datetime":1675506240000},{"category":"medical","amount":162.08,"datetime":1674805440000},{"category":"medical","amount":306.92,"datetime":1674726720000},{"category":"medical","amount":40.69,"datetime":1674319200000},{"category":"medical","amount":136.15,"datetime":1673924160000},{"category":"medical","amount":59.56,"datetime":1673169120000}]`)
      }}>TEMP TEST</button>
      <h1 class="text-4xl">Track your ₪</h1>
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
