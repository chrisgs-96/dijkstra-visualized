import React, { useState, useEffect } from 'react';
import Nodes from './Nodes';
import NodesTable from './NodesTable';
import Menu from './Menu';
import Lines from './Lines';

function DijkstraGraph(props) {
    const { mode, setMode, nodes, setNodes, vertexes, setVertexes, setModalText } = props;
    const [selectedNode, setSelectedNode] = useState(false);
    const [startingNode, setStartingNode] = useState(-1);
    const [finalNode, setFinalNode] = useState(-1);
    const [isRunningDijkstra, setIsRunningDijkstra] = useState(false);
    const [timeBetweenSteps, setTimeBetweenSteps] = useState(0);


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

    const resetNodesWeights = () => {
        const arr = [...nodes];
        for (let i = 0; i < arr.length; i += 1) {
            arr[i].weight = 99999999;
            arr[i].isVisited = false;
        }
        setNodes(arr);
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

    const updateVertexesAfterNodeRemoval = id => {
        let arr = [];
        let counter = 0;
        for (let i = 0; i < vertexes.length; i += 1) {
            if (vertexes[i].startId !== id && vertexes[i].endId !== id) {
                arr.push({
                    ...vertexes[i],
                    id: counter,
                    startId: vertexes[i].startId >= id ? vertexes[i].startId - 1 : vertexes[i].startId,
                    endId: vertexes[i].endId >= id ? vertexes[i].endId - 1 : vertexes[i].endId,
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
        updateVertexesAfterNodeRemoval(id);
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
        resetNodesWeights();
        changeNodeWeight(startingNode, 99999999);
        changeNodeWeight(finalNode, 99999999);
        setFinalNode(-1);
        setStartingNode(-1);
    }

    React.useEffect(() => {
        if (startingNode !== -1 && finalNode !== -1) {
            changeNodeWeight(startingNode, 0);
            startSolvingDijkstra();
        }
    }, [startingNode, finalNode])

    const returnConnectedVertexes = (id) => {
        let arr = [];
        for (let i = 0; i < vertexes.length; i += 1) {
            if (vertexes[i].startId === id || vertexes[i].endId === id) {
                arr.push(vertexes[i])
            }
        }
        return arr;
    }

    const returnNodeIndex = id => {
        for (let i = 0; i < nodes.length; i += 1) {
            if (nodes[i].id === id) {
                return i;
            }
        }
        return -1;
    }

    const updateNodeWeight = (nodeId, pathWeight) => {
        let index = returnNodeIndex(nodeId);
        if (nodes[index].weight > pathWeight) {
            let arr = [...nodes];
            arr[index].weight = pathWeight;
            setNodes(arr);
        }
        return;
    }

    const returnNodeWeight = (id) => {
        for (let i = 0; i < nodes.length; i += 1) {
            if (nodes[i].id === id) {
                return nodes[i].weight;
            }
        }
        return 0;
    }

    const markNodeAsVisited = id => {
        let arr = [...nodes];
        for (let i = 0; i < arr.length; i += 1) {
            if (arr[i].id === id) {
                arr[i].isVisited = true;
            }
        }
        setNodes(arr);
    }

    const examineNode = id => {
        const connectedVertexes = returnConnectedVertexes(id);
        for (let i = 0; i < connectedVertexes.length; i += 1) {
            if (connectedVertexes[i].startId !== id) {
                updateNodeWeight(connectedVertexes[i].startId, connectedVertexes[i].weight + returnNodeWeight(id));
            } else if (connectedVertexes[i].endId !== id) {
                updateNodeWeight(connectedVertexes[i].endId, connectedVertexes[i].weight + returnNodeWeight(id));
            }
        }
        markNodeAsVisited(id);
    }

    // returns the unvisited node with the smallest weight
    const returnNextNode = () => {
        let min = 999999999999;
        let minIndex = -1;
        for (let i = 0; i < nodes.length; i += 1) {
            if (!nodes[i].isVisited && nodes[i].weight < min) {
                min = nodes[i].weight;
                minIndex = i;
            }
        }
        if (minIndex !== -1) {
            return nodes[minIndex].id;
        } return -1;
    }

    const proceed = () => {
        setTimeout(() => {
            let nextNodeId = returnNextNode();
            if (nextNodeId === -1) {
                return
            } else {
                examineNode(nextNodeId);
                proceed();
            }
        }, timeBetweenSteps)
    }

    const startSolvingDijkstra = () => {
            examineNode(startingNode);
            proceed();
    }

    return (
        <>
            <Menu
                isRunningDijkstra={isRunningDijkstra}
                timeBetweenSteps={timeBetweenSteps}
                setTimeBetweenSteps={setTimeBetweenSteps}
                startingNode={startingNode}
                finalNode={finalNode}
                mode={mode}
                setMode={setMode}
            />
            <div className="canvas-and-logs">
                {isRunningDijkstra && <NodesTable nodes={nodes} />}
                <svg id="canvas" className="outer-canvas-container" onClick={e => createNode(e.clientX, e.clientY)}>
                    <Lines mode={mode} vertexes={vertexes} changeWeight={changeWeight} removeVertex={removeVertex} />
                    <Nodes
                        setModalText={setModalText}
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
            </div>
            <div className="buttons-container">
                {!isRunningDijkstra && <button className="function-button" onClick={startDijkstra}>Start Dijkstra</button>}
                {isRunningDijkstra && <button className="function-button" onClick={stopDijkstra}>Stop Dijkstra</button>}
                <button onClick={() => console.log(JSON.stringify(vertexes))}>print vertex</button>
                <button onClick={() => console.log(JSON.stringify(nodes))}>print node</button>
            </div>
        </>
    );
}

export default DijkstraGraph;
