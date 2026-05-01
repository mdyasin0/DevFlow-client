import { createBrowserRouter, Navigate } from "react-router";
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
import Joined_Team from "../Developer_dashboard/Joined_Team";
import Joined_Team_Details from "../Developer_dashboard/Joined_Team_Details";
import Admin_Dashboard_Layout from "../Admin_Dashboard/admin_dashboard_Layout";
import Email_Communication from "../Admin_Dashboard/Email_Communication";
import User_Administration from "../Admin_Dashboard/User_Administration";
import Site_Overview from "../Admin_Dashboard/Site_Overview";
import Project_Monitoring from "../Admin_Dashboard/Project_Monitoring";

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
      },{
          path: "/profile",
            element: <Profile />,
      },
      {
        path: "/developer_dashboard",
        element: <Dashboard_layout />,
        children: [
          { index: true, element: <Navigate to="/developer_dashboard/profile" />},
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
          },{
            path:"/developer_dashboard/joined_team" ,
            element: <Joined_Team/>,
          },{
            path:"/developer_dashboard/joined_team_details/:id",
            element:<Joined_Team_Details/>,
          }
        ],
      },{
        path:"/admin_dashboard_layout" ,
        element: <Admin_Dashboard_Layout/>,
      children:[
        
        { index: true, element: <Navigate to="/admin_dashboard_layout/email_communication" />},
        {
          path:"/admin_dashboard_layout/email_communication",
          element: <Email_Communication/>,
        },{
          path:"/admin_dashboard_layout/user_administration",
          element: <User_Administration/>,
        },{
          path:"/admin_dashboard_layout/site_overview",
          element: <Site_Overview/>,
        }, {
            path: "/admin_dashboard_layout/profile",
            element: <Profile />,
          },{
            path:"/admin_dashboard_layout/project_monitoring",
            element: <Project_Monitoring/>,
          }
      ]
      }
    ],
  },
]);

export default router;
