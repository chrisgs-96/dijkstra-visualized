import React, { useState, useEffect } from 'react';
import Nodes from './Nodes';
import AlgorithmInfoTable from './AlgorithmInfoTable';
import NodesTable from './NodesTable';
import Menu from './Menu';
import Lines from './Lines';

function DijkstraGraph(props) {
    const { mode, setMode, nodes, setNodes, vertexes, setVertexes, setModalText } = props;
    const [selectedNode, setSelectedNode] = useState(false);
    const [selectedNode2, setSelectedNode2] = useState(false);
    const [startingNode, setStartingNode] = useState(-1);
    // const [finalNode, setFinalNode] = useState(-1);
    const [isRunningDijkstra, setIsRunningDijkstra] = useState(false);
    // This state is used for the step by step version of the dijkstra
    const [manualMode, setManualMode] = useState(false);
    const [nodeToExamine, setNodeToExamine] = useState(false);
    const [vertexToExamine, setVertexToExamine] = useState(false);
    const [vertexesToExamine, setVertexesToExamine] = useState([]);
    const [explanation, setExplanation] = useState('');

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
            visitedFromNode: false,
        }]);
    }

    const resetNodesWeights = () => {
        const arr = [...nodes];
        for (let i = 0; i < arr.length; i += 1) {
            arr[i].weight = 99999999;
            arr[i].isVisited = false;
            arr[i].visitedFromNode = false;
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
                let weight = prompt("Please enter the new weight", 1);
                weight = parseInt(weight, 10);
                if (typeof (weight) === 'number' && weight >= 0) {
                    setVertexes([...vertexes, {
                        id: vertexes.length,
                        startTop: startNode.top + 18,
                        startLeft: startNode.left + 18,
                        endTop: endNode.top + 18,
                        endLeft: endNode.left + 18,
                        startId: startNode.id,
                        endId: endNode.id,
                        weight,
                    }])
                    setSelectedNode(false);
                } else {
                    setModalText('The weight value must be a number that\'s equal or greater than 0');
                }
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

    const startDijkstra = (isRunningManually) => {
        if (nodes.length < 2) {
            setModalText('Can not run Dijkstra with less than 2 nodes!');
            return;
        }
        if (vertexes.length === 0) {
            setModalText('Can not run Dijkstra with no vertexes!');
            return;
        }
        if (isRunningManually) {
            setManualMode(true);
        }
        setIsRunningDijkstra(true);
        setModalText('Please select the node from which you want to start!');
    }

    const stopDijkstra = () => {
        setIsRunningDijkstra(false);
        resetNodesWeights();
        changeNodeWeight(startingNode, 99999999);
        // changeNodeWeight(finalNode, 99999999);
        // setFinalNode(-1);
        setStartingNode(-1);
        setManualMode(false);
        setNodeToExamine(false);
        setVertexToExamine(false);
        setVertexesToExamine([]);
        setExplanation('');
        setSelectedNode(false);
        setSelectedNode2(false);
    }

    React.useEffect(() => {
        // if (startingNode !== -1 && finalNode !== -1) {
        if (startingNode !== -1) {
            if (!manualMode) {
                changeNodeWeight(startingNode, 0);
                startSolvingDijkstra();
            } else {
                changeNodeWeight(startingNode, 0);
                startSolvingDijkstraStepByStep();
            }
        }
    }, [startingNode])

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

    const updateNodeWeight = (nodeId, pathWeight, originNode) => {
        let index = returnNodeIndex(nodeId);
        if (nodes[index].weight > pathWeight) {
            let arr = [...nodes];
            arr[index].weight = pathWeight;
            arr[index].visitedFromNode = originNode;
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
                updateNodeWeight(connectedVertexes[i].startId, connectedVertexes[i].weight + returnNodeWeight(id), id);
            } else if (connectedVertexes[i].endId !== id) {
                updateNodeWeight(connectedVertexes[i].endId, connectedVertexes[i].weight + returnNodeWeight(id), id);
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
        let nextNodeId = returnNextNode();
        if (nextNodeId === -1) {
            return
        } else {
            examineNode(nextNodeId);
            proceed();
        }
    }

    const startSolvingDijkstra = () => {
        examineNode(startingNode);
        proceed();
    }

    const startSolvingDijkstraStepByStep = () => {
        setNodeToExamine(startingNode);
        setSelectedNode(startingNode);
        const vert = returnConnectedVertexes(startingNode);
        let arr = [];
        for (let i = 0; i < vert.length; i += 1) {
            arr.push({
                vertex: vert[i],
                isExamined: false,
            })
        }
        setVertexesToExamine(arr);
        setVertexToExamine(arr[0].vertex);
    }

    const proceedManually = () => {
        let vertexToExamineIndex = false;
        for (let i = 0; i < vertexesToExamine.length; i += 1) {
            if (!vertexesToExamine[i].isExamined) {
                vertexToExamineIndex = i;
                break;
            }
        }
        if (vertexToExamineIndex === false) {
            // we have searched ALL of the vertexes starting from this node so we need to find another node.
            markNodeAsVisited(nodeToExamine);
            let nextNodeId = returnNextNode();
            setSelectedNode(nextNodeId);
            if (nextNodeId === -1) {
                // we have searched all of the nodes and there is no node left
                setModalText('Dijkstra has finished executing.');
                setExplanation('Since all nodes are examined (visited) we have finished executing the algorithm.')
                setSelectedNode(false);
                return;
            } else {
                setNodeToExamine(nextNodeId);
                const vert = returnConnectedVertexes(nextNodeId);
                let arr = [];
                for (let i = 0; i < vert.length; i += 1) {
                    arr.push({
                        vertex: vert[i],
                        isExamined: false,
                    })
                }
                setVertexesToExamine(arr);
                setVertexToExamine(arr[0].vertex);
                setSelectedNode2(false);
                setExplanation('Since we have finished examining all the vertexes connected to the previous node, we mark it as visited and we start examining node #' + nextNodeId
                    + ' because this node is unvisited and has the lowest weight out of all the remaining nodes.');
            }
        } else {
            let otherEnd = vertexesToExamine[vertexToExamineIndex].vertex.startId === nodeToExamine ?
                vertexesToExamine[vertexToExamineIndex].vertex.endId :
                vertexesToExamine[vertexToExamineIndex].vertex.startId;
            setSelectedNode2(otherEnd);
            let expl = 'Examining the vertex that connects node ' + nodeToExamine + ' with ' + otherEnd + '. The node #' + nodeToExamine + ' has a weight of '
                + returnNodeWeight(nodeToExamine) + ' and the vertex that connects thse two has a weight of ' + vertexesToExamine[vertexToExamineIndex].vertex.weight
                + '. Node #' + otherEnd + ' has a weight of ' + returnNodeWeight(otherEnd) + '.';
            if (vertexesToExamine[vertexToExamineIndex].vertex.weight + returnNodeWeight(nodeToExamine) < returnNodeWeight(otherEnd)) {
                expl += ' In this case, since the weights of node #' + nodeToExamine + ' + the weight of the vertex that we\'re examining are smaller than the weight of node #'
                    + otherEnd + ', the weight of node #' + otherEnd + ' will change to the sum of node#' + nodeToExamine + ' + the vertex\'s weight';
            } else {
                expl += ' In this case, since node #' + nodeToExamine + ' + the weight of the vertex are bigger than the weight of node #' + otherEnd + ' we won\'t change the weight of node #' + otherEnd;
            }
            expl += '. When we are done with changing/not changing the node\'s weight, we mark this vertex as examined and move on to the next vertex/node';
            setExplanation(expl);
            updateNodeWeight(otherEnd, vertexesToExamine[vertexToExamineIndex].vertex.weight + returnNodeWeight(nodeToExamine), nodeToExamine);
            vertexesToExamine[vertexToExamineIndex].isExamined = true;
        }
    };

    return (
        <>
            <Menu
                isRunningDijkstra={isRunningDijkstra}
                startingNode={startingNode}
                // finalNode={finalNode}
                mode={mode}
                setMode={setMode}
            />
            <div className="canvas-and-logs">
                <div>
                    {isRunningDijkstra && <NodesTable nodes={nodes} />}
                    {(isRunningDijkstra && manualMode) &&
                        <AlgorithmInfoTable
                            explanation={explanation}
                            setExplanation={setExplanation}
                            vertexes={vertexesToExamine}
                            vertexToExamine={vertexToExamine}
                            nodes={nodes}
                            nodeToExamine={nodeToExamine}
                        />}
                </div>
                <svg id="canvas" className="outer-canvas-container" onClick={e => createNode(e.clientX, e.clientY)}>
                    <Lines mode={mode} vertexes={vertexes} changeWeight={changeWeight} removeVertex={removeVertex} />
                    <Nodes
                        setModalText={setModalText}
                        isRunningDijkstra={isRunningDijkstra}
                        startingNode={startingNode}
                        setStartingNode={setStartingNode}
                        // finalNode={finalNode}
                        // setFinalNode={setFinalNode}
                        selectedNode={selectedNode}
                        selectedNode2={selectedNode2}
                        connectNode={connectNode}
                        removeNode={removeNode}
                        nodes={nodes}
                        mode={mode}
                    />
                </svg>
            </div>
            <div className="buttons-container">
                {!isRunningDijkstra && <button className="function-button" onClick={() => startDijkstra()}>Start Dijkstra</button>}
                {!isRunningDijkstra && <button className="function-button" onClick={() => startDijkstra(true)}>Start Dijkstra (Step By Step)</button>}
                {isRunningDijkstra && manualMode && <button className="function-button" onClick={() => proceedManually()}>Next Step</button>}
                {isRunningDijkstra && <button className="function-button" onClick={stopDijkstra}>Stop Dijkstra</button>}
                <button onClick={() => console.log(JSON.stringify(vertexes))}>print vertex</button>
                <button onClick={() => console.log(JSON.stringify(nodes))}>print node</button>
            </div>
        </>
    );
}

export default DijkstraGraph;
