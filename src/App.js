import logo from './logo.svg';
import { useState } from 'react';
import DijkstraGraph from './components/DijkstraGraph/DijkstraGraph';
import Modal from './components/DijkstraGraph/Modal';
import './App.css';

function App() {

  const [mode, setMode] = useState(1);
  const [nodes, setNodes] = useState([]);
  const [vertexes, setVertexes] = useState([]);
  const [modalText, setModalText] = useState(false);

  const handleClick = (id) => {
  }

  return (
    <div className="App">
      <DijkstraGraph
        mode={mode}
        setMode={setMode}
        vertexes={vertexes}
        setVertexes={setVertexes}
        setModalText={setModalText}
        nodes={nodes}
        setNodes={setNodes}
      />
      <Modal modalText={modalText} setModalText={setModalText} />
    </div>
  );
}

export default App;
