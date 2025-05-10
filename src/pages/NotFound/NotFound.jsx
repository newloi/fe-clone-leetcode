import HeaderHome from "@/components/Header/HeaderHome";
import "./NotFound.css";
import notFound from "../../assets/404_face.png";

const NotFound = () => {
    return (
        <div className="container-home">
            <HeaderHome />
            <div className="body-home page-not-found">
                <div>
                    <img src={notFound} alt="Page Not Found" />
                    <div>
                        <h2>Page Not Found</h2>
                        Sorry, but we can't find the page you are looking for...
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
