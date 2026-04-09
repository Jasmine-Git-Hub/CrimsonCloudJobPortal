import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { Home } from "./components/Home";
import { JobDetails } from "./components/JobDetails";
import { MyApplications } from "./components/MyApplications";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "jobs/:id", Component: JobDetails },
      { path: "applications", Component: MyApplications },
      { path: "*", element: <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"><div className="text-center py-12"><p className="text-stone-600 text-lg">Page not found</p></div></div> },
    ],
  },
]);