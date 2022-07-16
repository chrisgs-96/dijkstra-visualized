
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
        selectedNode,
        setModalText,
    } = props;

    const handleNodeClick = (id) => {
        if (!isRunningDijkstra) {
            if (mode === 2) connectNode(id);
            if (mode === 4) removeNode(id);
        } else {
            if (startingNode === -1) {
                setStartingNode(id);
                setModalText('Now select the node to which you want to find the shortest path')
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
                const isHighlighted = selectedNode === node.id;
                return <g
                    key={i}
                    className={"cursor-pointer" + (startingNode === node.id ? ' start-node' : '') + (finalNode === node.id ? ' end-node' : '')}
                    onClick={e => handleNodeClick(node.id)} id={'node-' + node.id}
                >
                    <circle cx={node.left} cy={node.top} r="18" stroke={isHighlighted ? "red" : "black"} strokeWidth="3" fill={node.isVisited ? "rgb(220,220,220)" : "white"} />
                    <text x={node.left} y={node.top + 2}
                        textAnchor="middle"
                        stroke="red"
                        strokeWidth="1px"
                        alignmentBaseline="middle"
                    >
                        {node.id}
                    </text>
                    {isRunningDijkstra && <text x={node.left + 20} y={node.top - 22}
                        textAnchor="middle"
                        stroke="red"
                        strokeWidth="1px"
                        alignmentBaseline="middle"
                        fontSize={node.weight >= 99999999 ? "12px" : "10px"}
                    >
                        {node.weight >= 99999999 ? '∞' : node.weight}
                    </text>}
                </g>
            })
            }
        </>
    );
}

export default Nodes;
