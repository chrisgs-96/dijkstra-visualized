import React from "react";


function NodesTable(props) {
    const { nodes, convertIdToLetter } = props;
    return (
        <div className="node-info-grid">
            <div>ID</div>
            <div>Weight</div>
            <div>Visited</div>
            <div>Visited From</div>
            {nodes.map((node, i) => (
                <React.Fragment key={i}>
                    <div>{convertIdToLetter(node.id)}</div>
                    <div>{node.weight >= 99999999 ? '∞' : node.weight}</div>
                    <div>{node.isVisited ? 'Yes' : 'No'}</div>
                    <div>{node.visitedFromNode !== false ? convertIdToLetter(node.visitedFromNode) : '-'}</div>
                </React.Fragment>))}
        </div>
    );
}

export default NodesTable;
