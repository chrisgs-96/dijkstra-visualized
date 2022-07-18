

function Lines(props) {
    const { vertexes, isRunningDijkstra, removeVertex, changeWeight, mode } = props;

    const handleClick = id => {
        if (!isRunningDijkstra)
            if (mode === 4) {
                removeVertex(id)
            } else {
                changeWeight(id);
            }
    }
    // in some cases we will have to place the text more to the left/right/up/down
    // so this function calculates this offset by seeing the line's [x1,y1,x2,y2]
    const calculateTextPosition = (x1, x2, y1, y2) => {
        return {
            x: Math.abs((x1 + x2 - 58) / 2),
            y: Math.abs((y1 + y2 - 58) / 2)
        }
    }

    return (
        <>
            {vertexes.map((vertex, i) => {
                const position = calculateTextPosition(vertex.startLeft, vertex.endLeft, vertex.startTop, vertex.endTop);
                return <g
                    className="cursor-pointer"
                    key={i}
                    onClick={() => handleClick(vertex.id)}
                    onContextMenu={e => { if (!isRunningDijkstra) { e.preventDefault(); removeVertex(vertex.id) } }}

                >
                    <line
                        x1={vertex.startLeft - 18}
                        y1={vertex.startTop - 18}
                        x2={vertex.endLeft - 18}
                        y2={vertex.endTop - 18}
                        stroke="black"
                        strokeWidth="4"
                    />
                    <text
                        x={position.x}
                        y={position.y}
                        textAnchor="middle"
                        stroke="red"
                        strokeWidth="1px"
                        alignmentBaseline="middle"
                    >
                        {vertex.weight}
                    </text>
                </g>
            })}
        </>
    );
}

export default Lines;
