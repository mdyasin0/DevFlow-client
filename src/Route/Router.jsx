
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import App from "../App";
import Home from "../components/Home";
import Register from "../Auth/Register";
import Login from "../Auth/Login";
import Profile from "../Pages/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children : [
         { index: true, Component: Home },
         {
            path: "/register",
            element: <Register/>,
         },
         {
          path: "/login",
          element: <Login/>, 
         },{
          path: "/profile",
          element: <Profile/> ,
         }
    ]
  },
]);

export default router;


