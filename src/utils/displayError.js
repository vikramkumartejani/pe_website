
import toast from "react-hot-toast";
import formatFirebaseError from "../utils/formatFirebaseError";

const displayError = (error) => {
    toast.error(formatFirebaseError(error));
};

export default displayError;