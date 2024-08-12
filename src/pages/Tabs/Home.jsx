import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import MobileSidebar from "../../components/Sidebar/MobileSidebar";
import MobileChat from "../../components/Chat/MobileChat";
import { menu, mail, chat } from "../../assets/imageExport";
import { useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Logo from "../../assets/images/logo-88b07799.webp";
import Crash from "../../assets/images/crash-da900e5e.webp";
import Roulette from "../../assets/images/roulette.webp";
import Slots from "../../assets/images/slots.webp";
import Blackjack from "../../assets/images/blackjack.webp";
import Reme from "../../assets/images/reme.webp";
import Limbo from "../../assets/images/limbo.webp";
import Coinflip from "../../assets/images/coinflip.webp";
import Towers from "../../assets/images/towers.webp";
import Mines from "../../assets/images/mines.webp";
import Unboxing from "../../assets/images/unboxing.webp";
import "./Home.css";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [tabOpen, setTabOpen] = useState(null);

  const handleMenuOpen = useCallback(() => {
    if (menuOpen == false) {
      setTabOpen(
        <MobileSidebar
          closeMenu={() => {
            setTabOpen(null);
            setMenuOpen(false);
          }}
        />
      );
      setMenuOpen(true);
    } else {
      setTabOpen(null);
      setMenuOpen(false);
    }
  }, [menuOpen]);

  const handleChatOpen = useCallback(() => {
    if (chatOpen == false) {
      setTabOpen(
        <MobileChat
          closeChat={() => {
            setTabOpen(null);
            setChatOpen(false);
          }}
        />
      );
      setChatOpen(true);
    } else {
      setTabOpen(null);
      setChatOpen(false);
    }
  }, [chatOpen]);

  return (
    <>
      <div className="landing-page">
        <Sidebar />
        <Navbar />
        <section className="home-content">
          
          <div className="grow-dice-container">
            <img src={Logo} alt="Logo" />
            <p>The first Growtopia web-based gaming platform.</p>
            <button>Register Now</button>
          </div>

          <div className="boxes-crah">
            <button className="transition-transform ">
              <img src={Crash} alt="crash" />
            </button>
            <button>
              <img src={Roulette} alt="crash" />
            </button>
            <button>
              <img src={Slots} alt="crash" />
            </button>
            <button>
              <img src={Blackjack} alt="crash" />
            </button>
            <button>
              <img src={Reme} alt="crash" />
            </button>
            <button>
              <img src={Limbo} alt="crash" />
            </button>
            <button>
              <img src={Coinflip} alt="crash" />
            </button>
            <button>
              <img src={Towers} alt="crash" />
            </button>
            <button>
              <img src={Mines} alt="crash" />
            </button>
            <button>
              <img src={Unboxing} alt="crash" />
            </button>
          </div>
        </section>
      </div>
      <div className="MobileNav" style={{ display: "none" }}>
        <div className="Tab" onClick={handleMenuOpen}>
          <img src={menu} alt="menu icon" />
          <p>MENU</p>
        </div>
        <a className="Tab" href="https://discord.gg/GrowPvP" target="_blank">
          <img src={mail} alt="mail icon" />
          <p>SUPPORT</p>
        </a>
        <div className="Tab" onClick={handleChatOpen}>
          <img src={chat} alt="chat icon" />
          <p>CHAT</p>
        </div>
      </div>
      <AnimatePresence>{tabOpen}</AnimatePresence>
    </>
  );
}
