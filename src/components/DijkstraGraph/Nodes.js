
function Nodes(props) {
    const { mode, nodes, removeNode, connectNode } = props;

    const handleNodeClick = (id) => {
        if (mode === 1) return;
        if (mode === 2) connectNode(id);
        // if(mode === 3) 
        if (mode === 4) removeNode(id);
    }

    return (
        <>
            {nodes.map((node, i) => (
                <g onClick={e => handleNodeClick(node.id)} id={'node-' + node.id} >
                    <circle cx={node.left} cy={node.top} r="18" stroke="black" strokeWidth="3" fill="white" />
                    <text x={node.left} y={node.top + 2}
                        textAnchor="middle"
                        stroke="red"
                        strokeWidth="1px"
                        alignmentBaseline="middle"
                    >
                        {node.id}
                    </text>
                </g>))
            }
        </>
    );
}

export default Nodes;
