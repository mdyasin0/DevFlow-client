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
import Inactive_Users from "../Admin_Dashboard/Inactive_Users";
import PricingPage from "../Pages/PricingPage";
import Unauthorized from "../Pages/Unauthorized";
import ProtectedRoute from "../components/ProtectedRoute";
import NotFoundPage from "../Pages/NotFoundPage";
import SuccessPage from "../Pages/SuccessPage";
import CancelPage from "../Pages/CancelPage";

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
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/pricingpage",
        element: <PricingPage />,
      },
      {
        path: "/unauthorized",
        element: <Unauthorized />,
      },
      {
        path: "/developer_dashboard",
        element: 
        (
              <ProtectedRoute allowedRoles={["developer"]}>
                <Dashboard_layout />
              </ProtectedRoute>
            ),
        children: [
          {
            index: true,
            element: <Navigate to="/developer_dashboard/profile" />,
          },
          {
            path: "/developer_dashboard/profile",
            element: (
              <ProtectedRoute allowedRoles={["developer"]}>
                <Profile />
              </ProtectedRoute>
            ),
          },
          {
            path: "/developer_dashboard/developer_projects",
            element: (
              <ProtectedRoute allowedRoles={["developer"]}>
                <Developer_projects />
              </ProtectedRoute>
            ),
          },
          {
            path: "/developer_dashboard/created_project",
            element: (
              <ProtectedRoute allowedRoles={["developer"]}>
                <Created_project />
              </ProtectedRoute>
            ),
          },
          {
            path: "/developer_dashboard/created_project_details/:id",
            element: (
              <ProtectedRoute allowedRoles={["developer"]}>
                <Created_project_details />
              </ProtectedRoute>
            ),
          },
          {
            path: "/developer_dashboard/invitations",
            element: (
              <ProtectedRoute allowedRoles={["developer"]}>
                <Invitations />
              </ProtectedRoute>
            ),
          },
          {
            path: "/developer_dashboard/joined_team",
            element: (
              <ProtectedRoute allowedRoles={["developer"]}>
                <Joined_Team />
              </ProtectedRoute>
            ),
          },
          {
            path: "/developer_dashboard/joined_team_details/:id",
            element: (
              <ProtectedRoute allowedRoles={["developer"]}>
                <Joined_Team_Details />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "/admin_dashboard_layout",
        element: 
         (
              <ProtectedRoute allowedRoles={["admin"]}>
                <Admin_Dashboard_Layout />
              </ProtectedRoute>
            ),
        children: [
          {
            index: true,
            element: (
              <Navigate to="/admin_dashboard_layout/email_communication" />
            ),
          },
          {
            path: "/admin_dashboard_layout/email_communication",
            element: (
              <ProtectedRoute allowedRoles={["admin"]}>
                <Email_Communication />
              </ProtectedRoute>
            ),
          },
          {
            path: "/admin_dashboard_layout/user_administration",
            element:  (
              <ProtectedRoute allowedRoles={["admin"]}>
               <User_Administration />
              </ProtectedRoute>
            ),
          },
          {
            path: "/admin_dashboard_layout/site_overview",
            element: (
              <ProtectedRoute allowedRoles={["admin"]}>
               <Site_Overview />
              </ProtectedRoute>
            ),
          },
          {
            path: "/admin_dashboard_layout/profile",
            element:  (
              <ProtectedRoute allowedRoles={["admin"]}>
               <Profile />
              </ProtectedRoute>
            ),
          },
          {
            path: "/admin_dashboard_layout/project_monitoring",
            element:  (
              <ProtectedRoute allowedRoles={["admin"]}>
               <Project_Monitoring />
              </ProtectedRoute>
            ),
          },
          {
            path: "/admin_dashboard_layout/inactive_users",
            element:(
              <ProtectedRoute allowedRoles={["admin"]}>
                <Inactive_Users /> 
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },{
    path:"/success",
    element:<SuccessPage/>,
  },{
    path:"/cancel",
    element:<CancelPage/>,
  }
  ,
  {
    path:"*",
    element:<NotFoundPage/>,
  }
]);

export default router;
