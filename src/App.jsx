import Router from "./router";
import { io } from "socket.io-client";
import SocketContext from "./utils/SocketContext";
import UserContext from "./utils/UserContext";
import { useCallback, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { getJWT } from "./utils/api";
import "./global.css";
import config from "./config";
import ConnectRoblox from "./components/Account/ConnectRoblox";
import { AnimatePresence } from "framer-motion";
import { LazyMotion, domAnimation } from "framer-motion";
import Cookies from "js-cookie";
import { AuthContext } from "./providers/AuthProvider";

const socket = io(`${config.socket}/`, {
  reconnectionDelayMax: 10000,
  auth: {
    token: getJWT(),
  },
  transports: ["websocket"],
});

export default function App() {
  const [userData, setUserData] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [ConnectRobloxModal, setModalState] = useState(false);
  const { user } = useContext(AuthContext);

  const handleBalanceUpdate = useCallback(
    (balance) => {
      console.log(userData);
      setUserData({
        ...userData,
        balance: balance,
      });
    },
    [userData]
  );

  useEffect(() => {
    if (user) {
      fetch(`${config.api}/login-auto`, {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${getJWT()}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          try {
            // Growtopia Id not found, which means no Growtopia account is connected
            if (!data.GrowtopiaId) {
              setModalState(true);
            } else if (!data.GrowtopiaId) {
              Cookies.remove("jwt");
              setUserData(null);
            }
            setUserData(data);
          } catch (err) {
            console.error(err);
          }

          setLoadingData(false);
        });
    } else {
      setUserData(null);
      setLoadingData(false);
    }
  }, [user]);

  useEffect(() => {
    socket.on("BALANCE_UPDATE", handleBalanceUpdate);
    return () => {
      socket.off("BALANCE_UPDATE", handleBalanceUpdate);
    };
  }, [handleBalanceUpdate]);

  return (
    <>
      {loadingData && (
        <div className="LoadingScreen">
          <img src="" alt="GrowPvP Logo" />
        </div>
      )}

      {!loadingData && (
        <SocketContext.Provider value={socket}>
          <UserContext.Provider value={userData}>
            <LazyMotion features={domAnimation}>
              <Toaster
                toastOptions={{
                  style: {
                    // border: '1px solid #863aff',
                    padding: "16px",
                    color: "#fff",
                    background: "#120F22",
                  },
                  iconTheme: {
                    primary: "#863aff",
                    secondary: "#fff",
                  },
                }}
              />
              <AnimatePresence>
                {/* {ConnectRobloxModal && 
                <ConnectRobloxModal
                  closeModal={() => {
                    // To exit
                    // setModalState(null)
                    toast.error(
                      "Cannot exit, you must connect a Growtopia account."
                    );
                  }}
                />} */}
              </AnimatePresence>
              <Router />
            </LazyMotion>
          </UserContext.Provider>
        </SocketContext.Provider>
      )}
    </>
  );
}
