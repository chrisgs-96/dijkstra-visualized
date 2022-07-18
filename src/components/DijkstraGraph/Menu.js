

function Menu(props) {

    const {
        isRunningDijkstra,
        startingNode,
        // finalNode,
        mode,
        setMode,
    } = props;

    return (
        <>
            {!isRunningDijkstra && <div className="mode-select">
                <span className="mode-select-text">Select Mode:</span>
                <select value={mode} onChange={e => setMode(parseInt(e.target.value, 10))}>
                    <option value={1}>Add Node</option>
                    <option value={2}>Connect 2 nodes</option>
                    <option value={3}>Set Vertex Weight</option>
                    <option value={4}>Remove Node</option>
                </select>
            </div>}
            {isRunningDijkstra && <div style={{ margin: 'auto', textAlign: 'center' }}>
                <span className="starting-node-text">Starting Node: {startingNode}</span>
                {/* <span className="ending-node-text">Ending Node: {finalNode}</span> */}
            </div>}
        </>
    );
}

export default Menu;
