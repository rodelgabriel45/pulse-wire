import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import Notification from "./pages/Notification";
import Profile from "./pages/Profile";

const router = createBrowserRouter([
  {
    element: <Sidebar />,
    children: [
      {
        element: <RightPanel />,
        children: [
          { path: "/", element: <Home /> },
          { path: "/signup", element: <Signup /> },
          { path: "/login", element: <Login /> },
          { path: "/notifications", element: <Notification /> },
          { path: "/profile/:username", element: <Profile /> },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

export default App;
