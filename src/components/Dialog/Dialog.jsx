const Dialog = ({
    message,
    positiveBtnMessage,
    negativeBtnMessage,
    action,
    setIsShowDialog,
}) => {
    return (
        <>
            <div
                className="overlay dark-overlay"
                onClick={() => {
                    setIsShowDialog(false);
                }}
            ></div>
            <div className="banner-verify">
                <span>{message}</span>
                <div>
                    <button onClick={action}>{positiveBtnMessage}</button>
                    <button
                        onClick={() => {
                            setIsShowDialog(false);
                        }}
                    >
                        {negativeBtnMessage}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Dialog;
