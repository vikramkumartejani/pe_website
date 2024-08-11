import "./Login.css";
import PropTypes from "prop-types";
import { longLogo } from "../../assets/imageExport";
// import { useCallback, useState } from "react";
// import { toast } from "react-hot-toast";
import { m } from "framer-motion";
import config from "../../config";
import { getJWT, setJWT } from "../../utils/api";
import { useForm } from "react-hook-form";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import checkEmail from "../../utils/checkEmail";
import toast from "react-hot-toast";
import displayError from "../../utils/displayError";
import axios from "axios";
import Swal from "sweetalert2";

const Login = ({ closeModal }) => {
    // const handleCopyCode = useCallback(() => {
    //     navigator.clipboard.writeText(descriptionCode);
    //     toast("Code copied");
    // }, [descriptionCode]);
    const [formMode, setFormMode] = useState("login");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { signInWithPassword, createUser, updateInfo, passwordReset } =
        useAuth();
    // const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (data) => {
        const { email, password } = data;
        signInWithPassword(email, password)
            .then((result) => {
                console.log(result.user);
                setJWT(result.user.accessToken)
                if (!result.user.emailVerified) {
                    checkEmail(result.user.email, "to verify your email");
                } else {
                    toast.success("Login Successful");
                    closeModal();
                }
            })
            .catch((err) => {
                displayError(err);
            });
    };

    const handleRegister = async (data) => {
        const { name, email, password, image } = data;

        const imageUrl = await handleUploadImage(image);

        createUser(email, password)
            .then((result) => {
                const profile = {
                    displayName: name,
                    photoURL: imageUrl,
                };
                updateInfo(result.user, profile)
                    .then(() => {
                        console.log("profile updated", result.user);
                        // save to database
                        axios
                            .post(
                                `${config.api}/register`,
                                {
                                    email: email,
                                    displayName: name,
                                    photoURL: imageUrl,
                                    uid: result.user.uid,
                                },
                                {
                                    Authorization: `Bearer ${getJWT()}`,
                                }
                            )
                            .then((res) => {
                                console.log(res.data);
                            });
                        setFormMode("login");
                    })
                    .catch((error) => {
                        console.error(error.message);
                    });
            })
            .catch((err) => {
                displayError(err);
            });
    };

    const handleUploadImage = async (image) => {
        const imgForm = new FormData();
        console.log(image[0]);
        imgForm.append("image", image[0]);

        const imgApiUrl = `https://api.imgbb.com/1/upload?&key=${import.meta.env.VITE_IMG_BB_KEY
            }`;

        const config = {
            headers: {
                "content-Type": "multipart/form-data",
            },
        };

        try {
            const imgRes = await axios.post(imgApiUrl, imgForm, config);
            const imgUrl = imgRes?.data?.data?.url;

            return imgUrl;
        } catch {
            Swal.fire({
                icon: "error",
                title: "Upload Failed",
                text: "The selected image could not be uploaded. Please try a different image.",
            });
        }
    };

    const handleForgotPass = (data) => {
        const { email } = data;
        passwordReset(email)
            .then(() => {
                checkEmail(email, "to reset your password");
                setFormMode("login");
            })
            .catch((err) => {
                console.log(err);
                displayError(err);
            });
    };

    const onSubmit = (data) => {
        if (formMode === "login") {
            handleLogin(data);
        } else if (formMode === "register") {
            handleRegister(data);
        } else if (formMode === "forgot") {
            handleForgotPass(data);
        }
    };

    const handlePasswordValidate = (password) => {
        if (password === "") {
            return "Please fill in the password";
        } else if (formMode === "login") {
            return true;
        } else if (password.length < 6) {
            return "Password must be at least 6 characters long";
        } else if (!/[a-z]/.test(password) && !/[A-Z]/.test(password)) {
            return "Password must contain at least one letter";
        } else if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase letter";
        } else if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter";
        } else if (!/[0-9]/.test(password)) {
            return "Password must contain at least one number";
        } else if (
            !/(?=.*[~`!@#$%^&*()--+={}[\]|\\:;"'<>,.?/_₹]).*$/.test(password)
        ) {
            return "Password must contain at least one special character";
        }
        return true;
    };

    return (
        <>
            <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="ModalBackground"
                onClick={closeModal}
            >
                {/* {isLoading && (
                    <div className="loadingContainer">
                        <div className="loading"></div>
                    </div>
                )} */}

                <m.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    className="LoginModal"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="Art">
                        <img
                            src={longLogo}
                            alt="BLOXPVP Logo"
                            className="Logo"
                        />
                        <h1>
                            THE MOST REWARDING AND INNOVATIVE GROWTOPIA CASINO
                        </h1>
                        <p className="ArtFooter">
                            By signing in you confirm that you are 18 years of
                            age or over, of sound mind capable of taking
                            responsibility for your own actions & are in proper
                            jurisdiction, and have read and agreed to our terms
                            of service.
                        </p>
                    </div>
                    <div className="Login">
                        <div className="Content">
                            {formMode === "login" && (
                                <div className="Heading">
                                    <h2>Log in to your account</h2>
                                    <p className="Subtext">
                                        Use your email and password to log in
                                        and enjoy our services.
                                    </p>
                                </div>
                            )}
                            {formMode === "register" && (
                                <div className="Heading">
                                    <h2>Create Your Account</h2>
                                    <p className="Subtext">
                                        Sign up with your email and create a
                                        password to start using our platform.
                                    </p>
                                </div>
                            )}
                            {formMode === "forgot" && (
                                <div className="Heading">
                                    <h2>Reset Your Password</h2>
                                    <p className="Subtext">
                                        Enter your email address to receive a
                                        link to reset your password.
                                    </p>
                                </div>
                            )}
                            <form
                                action=""
                                // onSubmit={(e) => handleLoginSubmit(e)}
                                onSubmit={handleSubmit(onSubmit)}
                                style={{ padding: "10px 0" }}
                            >
                                {formMode === "register" && (
                                    <div className="form-group">
                                        <label
                                            className="inputLabel"
                                            htmlFor="name"
                                        >
                                            Name
                                        </label>
                                        <input
                                            className="input"
                                            id="name"
                                            type="text"
                                            {...register("name", {
                                                required:
                                                    "Please enter your name",
                                            })}
                                            placeholder="Your Email Address"
                                        />
                                        {errors.name && (
                                            <p className="LoginError">
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="form-group">
                                    <label
                                        className="inputLabel"
                                        htmlFor="email"
                                    >
                                        Email Address
                                    </label>
                                    <input
                                        className="input"
                                        id="email"
                                        type="text"
                                        {...register("email", {
                                            required:
                                                "Please enter your email address.",
                                            pattern: {
                                                value: /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                                message: "Invalid email",
                                            },
                                        })}
                                        placeholder="Your Email Address"
                                    />
                                    {errors.email && (
                                        <p className="LoginError">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                {(formMode === "register" ||
                                    formMode === "login") && (
                                        <div className="form-group">
                                            <label
                                                className="inputLabel"
                                                htmlFor="password"
                                            >
                                                Password
                                            </label>
                                            <input
                                                className="input"
                                                id="password"
                                                type="password"
                                                {...register("password", {
                                                    validate:
                                                        handlePasswordValidate,
                                                })}
                                                placeholder="Enter Your Password"
                                            />
                                            {errors.password && (
                                                <p className="LoginError">
                                                    {errors.password.message}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                {formMode === "register" && (
                                    <div className="form-group">
                                        <label
                                            className="inputLabel"
                                            htmlFor="name"
                                        >
                                            Profile Image
                                        </label>
                                        <input
                                            className="input file-input"
                                            id="name"
                                            type="file"
                                            {...register("image", {
                                                required:
                                                    "Upload your profile image",
                                            })}
                                            placeholder="Your Email Address"
                                        />
                                        {errors.image && (
                                            <p className="LoginError">
                                                {errors.image.message}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <button type="submit">
                                    {formMode === "login" && "Login"}
                                    {formMode === "register" && "Register"}
                                    {formMode === "forgot" && "Reset Password"}
                                </button>
                            </form>
                            {formMode === "login" && (
                                <div className="bellowLoginDiv">
                                    <p
                                        onClick={() => setFormMode("forgot")}
                                        className="bellowLoginFrom"
                                        style={{ cursor: "pointer" }}
                                    >
                                        Forgot Password?
                                    </p>
                                    <p
                                        className="bellowLoginFrom"
                                        style={{ marginTop: "10px" }}
                                    >
                                        Don&apos;t have an account?{" "}
                                        <span
                                            onClick={() =>
                                                setFormMode("register")
                                            }
                                            className="bellowLoginFromToggle"
                                        >
                                            Register Now
                                        </span>
                                    </p>
                                </div>
                            )}
                            {formMode === "register" && (
                                <p className="bellowLoginFrom">
                                    Already have an account?{" "}
                                    <span
                                        onClick={() => setFormMode("login")}
                                        className="bellowLoginFromToggle"
                                    >
                                        Login
                                    </span>
                                </p>
                            )}
                            {formMode === "forgot" && (
                                <p className="bellowLoginFrom">
                                    Remember Password?{" "}
                                    <span
                                        onClick={() => setFormMode("login")}
                                        className="bellowLoginFromToggle"
                                    >
                                        Login
                                    </span>
                                </p>
                            )}
                        </div>
                        <div className="Footer">
                            <p className="FooterText">
                                By signing in you confirm that you are 18 years
                                of age or over, of sound mind capable of taking
                                responsibility for your own actions & are in
                                proper jurisdiction, and have read and agreed to
                                our terms of service.
                            </p>
                            <div className="ExtraLinks">
                                <p className="Terms">Terms of Use</p>
                                <p className="Support">Support</p>
                            </div>
                        </div>
                    </div>
                </m.div>
            </m.div>
        </>
    );
};

Login.propTypes = {
    closeModal: PropTypes.func,
    submitForm: PropTypes.func,
};

export default Login;
