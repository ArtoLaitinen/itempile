import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./pages/RootLayout";
import AllItemsPage from "./pages/AllItemsPage";

import "./App.css";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [{ index: true, element: <AllItemsPage /> }],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
