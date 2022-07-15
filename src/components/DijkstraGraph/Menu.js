

function Menu(props) {

    const {
        isRunningDijkstra,
        timeBetweenSteps,
        setTimeBetweenSteps,
        startingNode,
        finalNode,
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
            {isRunningDijkstra &&
                <div className="mode-select">
                    <span className="mode-select-text">Time between each step: </span>
                    <input type="range" min="0" max="5000" value={timeBetweenSteps} onChange={e => setTimeBetweenSteps(e.target.value)}></input>
                    <span className="mode-select-text">{(timeBetweenSteps / 1000).toFixed(2)} seconds</span>
                </div>
            }
            {isRunningDijkstra && <div style={{ margin: 'auto', textAlign: 'center' }}>
                <span className="starting-node-text">Starting Node: {startingNode}</span>
                <span className="ending-node-text">Ending Node: {finalNode}</span>
            </div>}
        </>
    );
}

export default Menu;
