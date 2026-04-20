
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import App from "../App";
import Home from "../components/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    children : [
         { index: true, Component: Home },
         {
            path: "/hello",
            element: <h1>hi</h1>,
         }
    ]
  },
]);

export default router;


