import ReactDOM from "react-dom/client";
import React from "react";
import App from "./App";
import "./global.css";
import AuthProvider from "./providers/AuthProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <App></App>
        </AuthProvider>
    </React.StrictMode>
);
