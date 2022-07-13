import { useState, useEffect } from 'react';
import Nodes from './Nodes';
import Lines from './Lines';

function DijkstraGraph(props) {
    const { mode, nodes, setNodes, vertexes, setVertexes } = props;
    const [selectedNode, setSelectedNode] = useState(false);

    useEffect(() => { setSelectedNode(false) }, [mode]);

    const createNode = (x, y) => {
        if (mode !== 1) return;
        let canv = document.getElementById('canvas');
        let canvCoordinates = canv.getBoundingClientRect();
        let elPositionY = y - canvCoordinates.top;
        let elPositionX = x - canvCoordinates.left;
        setNodes([...nodes, {
            id: nodes.length,
            top: elPositionY,
            left: elPositionX,
        }]);
    }

    const connectNode = id => {
        if (selectedNode === false) {
            setSelectedNode(id);
        } else {
            console.log('connect ', selectedNode, ' with ', id);
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
        console.log(arr);
        setVertexes([...arr]);
    }

    const changeWeight = (id) => {
        let arr = [...vertexes];
        let newWeight = prompt("Please enter the new weight", 1);
        for (let i = 0; i < arr.length; i += 1) {
            if (arr[i].id === id) {
                arr[i].weight = newWeight;
                break;
            }
        }
        setVertexes([...arr]);
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
        console.log(arr);
        setNodes([...arr]);
    }

    return (
        <>
            <span>node that's selected: {selectedNode}</span>
            <svg id="canvas" className="outer-canvas-container" onClick={e => createNode(e.clientX, e.clientY)}>
                <Lines vertexes={vertexes} changeWeight={changeWeight} removeVertex={removeVertex} />
                <Nodes connectNode={connectNode} removeNode={removeNode} nodes={nodes} mode={mode} />
            </svg>
        </>
    );
}

export default DijkstraGraph;
