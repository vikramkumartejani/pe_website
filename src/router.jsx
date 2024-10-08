import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Tabs/Home";
import Jackpot from "./pages/Tabs/Jackpot";
import Marketplace from "./pages/Tabs/Marketplace";
import Error from "./pages/Error/Error";
import Coinflip from "./pages/Tabs/Coinflip";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path: "/coinflip",
    element: <Coinflip />,
    errorElement: <Error />,
  },
  {
    path: "/jackpot",
    element: <Jackpot />,
  },
  {
    path: "/marketplace",
    element: <Marketplace />,
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
