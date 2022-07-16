

function NodesTable(props) {
    const { nodes } = props;
    return (
        <div className="node-info-grid">
            <div>ID</div>
            <div>Weight</div>
            <div>Visited</div>
            {nodes.map(node => (<>
                <div>{node.id}</div>
                <div>{node.weight >= 99999999 ? '∞' : node.weight}</div>
                <div>{node.isVisited ? 'Yes' : 'No'}</div>
            </>))}
        </div>
    );
}

export default NodesTable;
