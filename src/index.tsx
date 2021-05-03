import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import * as esbuild from 'esbuild-wasm';

import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

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
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'
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
      plugins: [
        unpkgPathPlugin(),
        fetchPlugin(input)
      ],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      }
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