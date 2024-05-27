import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import Notification from "./pages/Notification";
import Profile from "./pages/Profile";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const router = createBrowserRouter([
  {
    element: <Sidebar />,
    children: [
      {
        element: <RightPanel />,
        children: [
          {
            element: <ProtectedRoute />,
            children: [
              {
                path: "/",
                element: <Home />,
              },

              { path: "/notifications", element: <Notification /> },
              { path: "/profile/:username", element: <Profile /> },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <PublicRoute />,
    children: [
      { path: "/signup", element: <Signup /> },
      { path: "/login", element: <Login /> },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
      <Toaster />
    </>
  );
}

export default App;
