import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { Bounce, toast } from "react-toastify";
import useAuth from "../hooks/useAuth";

const PrivateRoute = ({ children }) => {
    const location = useLocation();
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-[50vh] flex justify-center items-center">
                <ThreeDots
                    visible={true}
                    height="80"
                    width="80"
                    color="#403F3F"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                />
            </div>
        );
    }

    if (user) {
        return children;
    }

    toast.warn("Access Denied: Please Log In", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
    });

    return <Navigate state={location.pathname} to="/login"></Navigate>;
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PrivateRoute;
