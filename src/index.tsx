import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import * as esbuild from 'esbuild-wasm';

import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

const App = () => {
  const service = useRef<any>();
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    startService();
  }, []);

  const startService = async () => {
    service.current = await esbuild.startService({
      worker: true,
      wasmURL: '/esbuild.wasm'
    });
  };

  const onClick = async () => {
    if (!service.current) {
      return;
    }

    const result = await service.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
    });

    setCode(result.outputFiles[0].text);
  }

  return (
    <div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <div>
        <button onClick={onClick}>
          Submit
        </button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

ReactDOM.render(
  <App />,
  document.querySelector('#root')
);