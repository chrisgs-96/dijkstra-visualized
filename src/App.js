import logo from './logo.svg';
import { useState } from 'react';
import DijkstraGraph from './components/DijkstraGraph/DijkstraGraph';
import './App.css';

function App() {

  const [mode, setMode] = useState(1);
  const [nodes, setNodes] = useState([]);
  const [vertexes, setVertexes] = useState([]);

  const handleClick = (id) => {
  }

  return (
    <div className="App">
      <span>Mode {mode}</span>
      <div onClick={() => setMode(1)}>Mode 1 (create node)</div>
      <div onClick={() => setMode(2)}>Mode 2 (connect node)</div>
      <div onClick={() => setMode(3)}>Mode 3 (set weights)</div>
      <div onClick={() => setMode(4)}>Mode 4 (remove connect)</div>
      <DijkstraGraph
        mode={mode}
        vertexes={vertexes}
        setVertexes={setVertexes}
        nodes={nodes}
        setNodes={setNodes}
      />
    </div>
  );
}

export default App;
