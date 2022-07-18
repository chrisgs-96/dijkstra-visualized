import React from "react";


function AlgorithmInfoTable(props) {
    const { nodes, nodeToExamine, vertexes, vertexToExamine, explanation, convertIdToLetter, } = props;
    const [nodesWeightMap, setNodesWeightMap] = React.useState({});
    const [oldNodeWeight, setOldNodeWeight] = React.useState(false);

    React.useEffect(() => {
        let arr = {};
        for (let i = 0; i < nodes.length; i += 1) {
            arr[nodes[i].id] = nodes[i].weight;
        }
        setNodesWeightMap(arr);
    }, [nodes])

    React.useEffect(() => {
        let endNode = -1;
        for (let i = 0; i < vertexes.length; i += 1) {
            if (vertexes[i].vertex.id === vertexToExamine) {
                endNode = vertexes[i].vertex.startId === nodeToExamine ? vertexes[i].vertex.endId : vertexes[i].vertex.startId;
                setOldNodeWeight(nodesWeightMap[endNode]);
                break;
            }
        }
    }, [vertexToExamine])

    return (
        <div>
            <span className="algorithm-info-grid-span">Currently examining node {nodeToExamine} that has the following vertexes: </span>
            <div className="algorithm-info-grid">
                <div>Start Node</div>
                <div>Weight</div>
                <div>End Node</div>
                <div>Weight</div>
                <div>Vertex Weight</div>
                <div>Is Examined</div>
                {vertexes.map(vertex => {
                    let endNode = vertex.vertex.startId === nodeToExamine ? vertex.vertex.endId : vertex.vertex.startId;
                    return <>
                        {/* node.weight >= 99999999 ? '∞' : node.weight */}
                        <div>Node {convertIdToLetter(nodeToExamine)}</div>
                        <div>{nodesWeightMap[nodeToExamine] >= 99999999 ? '∞' : nodesWeightMap[nodeToExamine]}</div>
                        <div>Node {convertIdToLetter(endNode)}</div>
                        <div>{nodesWeightMap[endNode] >= 99999999 ? '∞' : nodesWeightMap[endNode]}</div>
                        <div>{vertex.vertex.weight >= 99999999 ? '∞' : vertex.vertex.weight}</div>
                        <div>{vertex.isExamined ? 'Yes' : 'No'}</div>
                    </>
                })}
            </div>
            <span className="explanation">{explanation}</span>
        </div>
    );
}

export default AlgorithmInfoTable;
