import { useState, useEffect } from 'react';
import Nodes from './Nodes';
import Lines from './Lines';

function DijkstraGraph(props) {
    const { mode, setMode, nodes, setNodes, vertexes, setVertexes, setModalText } = props;
    const [selectedNode, setSelectedNode] = useState(false);
    const [startingNode, setStartingNode] = useState(-1);
    const [finalNode, setFinalNode] = useState(-1);
    const [isRunningDijkstra, setIsRunningDijkstra] = useState(false);

    useEffect(() => { setSelectedNode(false) }, [mode]);

    const createNode = (x, y) => {
        if (mode !== 1 || isRunningDijkstra) return;
        let canv = document.getElementById('canvas');
        let canvCoordinates = canv.getBoundingClientRect();
        let elPositionY = y - canvCoordinates.top;
        let elPositionX = x - canvCoordinates.left;
        setNodes([...nodes, {
            id: nodes.length,
            top: elPositionY,
            left: elPositionX,
            weight: 99999999,
            isVisited: false,
        }]);
    }

    const changeNodeWeight = (id, weight) => {
        let arr = [...nodes];
        for (let i = 0; i < arr.length; i += 1) {
            if (arr[i].id === id) {
                arr[i].weight = weight;
                break;
            }
        }
        setNodes([...arr]);
    }

    const connectNode = id => {
        if (selectedNode === false) {
            setSelectedNode(id);
        } else {
            if (id === selectedNode) {
                setModalText('Can\'t connect the same node with itself');
                setSelectedNode(false);
                return;
            }
            if (!doesVertexExist(selectedNode, id)) {
                let startNode = undefined;
                let endNode = undefined;
                for (let i = 0; i < nodes.length; i += 1) {
                    if (nodes[i].id === selectedNode) {
                        startNode = nodes[i];
                    }
                    if (nodes[i].id === id) {
                        endNode = nodes[i];
                    }
                    if (endNode && startNode) {
                        break;
                    }
                }
                setVertexes([...vertexes, {
                    id: vertexes.length,
                    startTop: startNode.top + 18,
                    startLeft: startNode.left + 18,
                    endTop: endNode.top + 18,
                    endLeft: endNode.left + 18,
                    startId: startNode.id,
                    endId: endNode.id,
                    weight: 1,
                }])
                setSelectedNode(false);
            }
        }
    }

    const doesVertexExist = (id1, id2) => {
        for (let i = 0; i < vertexes.length; i += 1) {
            if ((vertexes[i].startId === id1 || vertexes[i].startId === id2) && (vertexes[i].endId === id1 || vertexes[i].endId === id2)) {
                setModalText('The vertex you\'re trying to create already exists!');
                setSelectedNode(false);
                return true;
            }
        }
    }

    const removeVertex = (id) => {
        let arr = [];
        let counter = 0;
        for (let i = 0; i < vertexes.length; i += 1) {
            if (vertexes[i].id !== id) {
                arr.push({
                    ...vertexes[i],
                    id: counter,
                })
                counter += 1;
            }
        }
        setVertexes([...arr]);
    }

    const massRemoveVertexes = idsArray => {
        let arr = [];
        let counter = 0;
        for (let i = 0; i < vertexes.length; i += 1) {
            if (!idsArray.includes(vertexes[i].id)) {
                arr.push({
                    ...vertexes[i],
                    id: counter,
                })
                counter += 1;
            }
        }
        setVertexes([...arr]);
    }

    const changeWeight = (id) => {
        let arr = [...vertexes];
        let newWeight = prompt("Please enter the new weight", 1);
        newWeight = parseInt(newWeight, 10);
        if (typeof (newWeight) === 'number' && newWeight >= 0) {

            for (let i = 0; i < arr.length; i += 1) {
                if (arr[i].id === id) {
                    arr[i].weight = newWeight;
                    break;
                }
            }
            setVertexes([...arr]);
        } else {
            setModalText('The weight value must be a number that\'s equal or greater than 0');
        }
    }

    const removeNode = (id) => {
        let arr = [];
        let counter = 0;
        for (let i = 0; i < nodes.length; i += 1) {
            if (nodes[i].id !== id) {
                arr.push({
                    ...nodes[i],
                    id: counter,
                })
                counter += 1;
            }
        }
        // looking for vertexes containing this node so that we can delete them.
        let connectedVertexesArr = [];
        for (let i = 0; i < vertexes.length; i += 1) {
            if (vertexes[i].startId === id || vertexes[i].endId === id) {
                connectedVertexesArr.push(vertexes[i].id);
            }
        }
        massRemoveVertexes(connectedVertexesArr);
        setNodes([...arr]);
    }

    const startDijkstra = () => {
        if (nodes.length < 2) {
            setModalText('Can not run Dijkstra with less than 2 nodes!');
            return;
        }
        if (vertexes.length === 0) {
            setModalText('Can not run Dijkstra with no vertexes!');
            return;
        }
        setIsRunningDijkstra(true);
        setModalText('Please select the node from which you want to start!');
    }

    const stopDijkstra = () => {
        setIsRunningDijkstra(false);
        setFinalNode(-1);
        setStartingNode(-1);
    }

    return (
        <>
            {!isRunningDijkstra && <div className="mode-select">
                <span className="mode-select-text">Select Mode:</span>
                <select value={mode} onChange={e => setMode(parseInt(e.target.value, 10))}>
                    <option value={1}>Add Node</option>
                    <option value={2}>Connect 2 nodes</option>
                    <option value={3}>Set Vertex Weight</option>
                    <option value={4}>Remove Node</option>
                </select>
            </div>}
            {isRunningDijkstra && <div style={{ margin: 'auto', textAlign: 'center' }}>
                <span className="starting-node-text">Starting Node: {startingNode}</span>
                <span className="ending-node-text">Ending Node: {finalNode}</span>
            </div>}
            <svg id="canvas" className="outer-canvas-container" onClick={e => createNode(e.clientX, e.clientY)}>
                <Lines vertexes={vertexes} changeWeight={changeWeight} removeVertex={removeVertex} />
                <Nodes
                    isRunningDijkstra={isRunningDijkstra}
                    startingNode={startingNode}
                    setStartingNode={setStartingNode}
                    finalNode={finalNode}
                    setFinalNode={setFinalNode}
                    selectedNode={selectedNode}
                    connectNode={connectNode}
                    removeNode={removeNode}
                    nodes={nodes}
                    mode={mode}
                />
            </svg>
            <div className="buttons-container">
                {!isRunningDijkstra && <button className="function-button" onClick={startDijkstra}>Start Dijkstra</button>}
                {isRunningDijkstra && <button className="function-button" onClick={stopDijkstra}>Stop Dijkstra</button>}
            </div>
        </>
    );
}

export default DijkstraGraph;
