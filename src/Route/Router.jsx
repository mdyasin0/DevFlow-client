import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import App from "../App";

import Register from "../Auth/Register";
import Login from "../Auth/Login";
import Profile from "../Pages/Profile";
import Home from "../Pages/Home";
import Dashboard_layout from "../Developer_dashboard/Dashboard_layout";
import Developer_projects from "../Developer_dashboard/Developer_projects";
import Created_project from "../Developer_dashboard/Created_project";
import Created_project_details from "../Developer_dashboard/Created_project_details";
import Invitations from "../Developer_dashboard/Invitations";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, Component: Home },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/developer_dashboard",
        element: <Dashboard_layout />,
        children: [
          { index: true, element: <Profile /> },
          {
            path: "/developer_dashboard/profile",
            element: <Profile />,
          },{
            path:"/developer_dashboard/developer_projects" ,
            element: <Developer_projects/> ,
          },{
            path:"/developer_dashboard/created_project" ,
            element : <Created_project/>,
          },{
            path:"/developer_dashboard/created_project_details/:id",
            element:<Created_project_details/>,
          },
          {
            path:"/developer_dashboard/invitations" ,
            element: <Invitations/>,
          }
        ],
      },
    ],
  },
]);

export default router;
