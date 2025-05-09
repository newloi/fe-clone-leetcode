import "./Footer.css";

const Footer = ({ page, setPage, maxPage }) => {
    return (
        <>
            {maxPage > 1 && (
                <div className="footer">
                    <span
                        className={`pre-page ${
                            page === 1 ? "visibility-hidden" : ""
                        }`}
                        onClick={() => {
                            setPage((pre) => pre - 1);
                        }}
                    >
                        <i className="fa-solid fa-circle-chevron-left" /> Pre
                    </span>
                    <span
                        className={`next-page ${
                            page == maxPage ? "visibility-hidden" : ""
                        }`}
                        onClick={() => {
                            setPage((pre) => pre + 1);
                        }}
                    >
                        Next <i className="fa-solid fa-circle-chevron-right" />
                    </span>
                </div>
            )}
        </>
    );
};

export default Footer;
