
function Nodes(props) {
    const {
        mode,
        nodes,
        selectedNode2,
        isRunningDijkstra,
        startingNode,
        setStartingNode,
        // finalNode,
        // setFinalNode,
        removeNode,
        connectNode,
        convertIdToLetter,
        selectedNode,
        hasFinished,
        findOriginNode,
        setModalText,
    } = props;

    const handleNodeClick = (id) => {
        if (isRunningDijkstra && hasFinished) {
            setModalText('The path for node ' + convertIdToLetter(id) + ' is: \n' + findOriginNode(startingNode, id));
        }
        if (!isRunningDijkstra) {
            if (mode === 2) connectNode(id);
            if (mode === 4) removeNode(id);
        } else {
            if (startingNode === -1) {
                setStartingNode(id);
                // setModalText('Now select the node to which you want to find the shortest path')
                return;
            }
            // if (finalNode === -1) {
            //     setFinalNode(id);
            //     return;
            // }
        }
    }

    return (
        <>
            {nodes.map((node, i) => {
                const isHighlighted = selectedNode === node.id || selectedNode2 === node.id;
                return <g
                    key={i}
                    // className={"cursor-pointer" + (startingNode === node.id ? ' start-node' : '') + (finalNode === node.id ? ' end-node' : '')}
                    className={"cursor-pointer"}
                    onClick={e => handleNodeClick(node.id)} id={'node-' + node.id}
                    onContextMenu={e => { if (!isRunningDijkstra) { e.preventDefault(); removeNode(node.id) } }}
                >
                    <circle cx={node.left} cy={node.top} r="18" stroke={isHighlighted ? "red" : "black"} strokeWidth="3" fill={node.isVisited ? "rgb(220,220,220)" : "white"} />
                    <text x={node.left} y={node.top + 2}
                        textAnchor="middle"
                        stroke="red"
                        strokeWidth="1px"
                        alignmentBaseline="middle"
                    >
                        {convertIdToLetter(node.id)}
                    </text>
                    {isRunningDijkstra && <text x={node.left + 20} y={node.top - 22}
                        textAnchor="middle"
                        stroke="red"
                        strokeWidth="1px"
                        alignmentBaseline="middle"
                        fontSize={node.weight >= 99999999 ? "12px" : "10px"}
                    >
                        {node.weight >= 99999999 ? '???' : node.weight}
                    </text>}
                </g>
            })
            }
        </>
    );
}

export default Nodes;
