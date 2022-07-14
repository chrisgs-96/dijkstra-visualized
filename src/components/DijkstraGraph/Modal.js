

function Modal(props) {
    const { modalText, setModalText } = props;
    if (!modalText) {
        return;
    }
    return (
        <div className="modal-background">
            <div className="modal-background-overlay" onClick={() => setModalText(false)} />
            <div className="modal">
                <span>{modalText}</span>
                <button
                    onClick={() => setModalText(false)}
                    className="function-button">
                    Close
                </button>
            </div>
        </div>
    );
}

export default Modal;
