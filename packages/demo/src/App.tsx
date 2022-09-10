import { useState } from 'preact/hooks';
import preactLogo from './assets/preact.svg';
import { View } from './View';
import { DropArea } from './DropArea';
import './App.css';

export function App() {
  const [show, setShow] = useState(false);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://preactjs.com" target="_blank">
          <img src={preactLogo} class="logo preact" alt="Preact logo" />
        </a>
      </div>
      <h1>Vite + Preact</h1>

      <DropArea />

      {!show ? (
        <button onClick={() => setShow(true)}>打开摄像头</button>
      ) : (
        <View />
      )}
    </>
  );
}
