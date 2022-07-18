

function NodesTable(props) {
    const { nodes } = props;
    return (
        <div className="node-info-grid">
            <div>ID</div>
            <div>Weight</div>
            <div>Visited</div>
            <div>Visited From</div>
            {nodes.map(node => (<>
                <div>{node.id}</div>
                <div>{node.weight >= 99999999 ? '∞' : node.weight}</div>
                <div>{node.isVisited ? 'Yes' : 'No'}</div>
                <div>{node.visitedFromNode !== false ? node.visitedFromNode : '-'}</div>
            </>))}
        </div>
    );
}

export default NodesTable;
