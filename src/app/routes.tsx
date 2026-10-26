import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { JobDetails } from "./components/JobDetails";
import { MyApplications } from "./components/MyApplications";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "jobs/:id", Component: JobDetails },
      { path: "applications", Component: MyApplications },
      { path: "*", Component: NotFound },
    ],
  },
]);