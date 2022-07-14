
function Nodes(props) {
    const {
        mode,
        nodes,
        isRunningDijkstra,
        startingNode,
        setStartingNode,
        finalNode,
        setFinalNode,
        removeNode,
        connectNode,
        selectedNode
    } = props;

    const handleNodeClick = (id) => {
        if (!isRunningDijkstra) {
            if (mode === 2) connectNode(id);
            if (mode === 4) removeNode(id);
        } else {
            if (startingNode === -1) {
                setStartingNode(id);
                alert('Now select the node to which you want to find the shortest path')
                return;
            }
            if (finalNode === -1) {
                setFinalNode(id);
                return;
            }
        }
    }

    return (
        <>
            {nodes.map((node, i) => {
                const isHighlighed = selectedNode === node.id;
                return <g
                    className={"cursor-pointer" + (startingNode === node.id ? ' start-node' : '') + (finalNode === node.id ? ' end-node' : '')}
                    onClick={e => handleNodeClick(node.id)} id={'node-' + node.id}
                >
                    <circle cx={node.left} cy={node.top} r="18" stroke={isHighlighed ? "red" : "black"} strokeWidth="3" fill={node.isVisited ? "gray" : "white"} />
                    <text x={node.left} y={node.top + 2}
                        textAnchor="middle"
                        stroke="red"
                        strokeWidth="1px"
                        alignmentBaseline="middle"
                    >
                        {node.id}
                    </text>
                </g>
            })
            }
        </>
    );
}

export default Nodes;
