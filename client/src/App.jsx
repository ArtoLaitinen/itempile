import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RootLayout from "./pages/RootLayout";
import AllItemsPage from "./pages/AllItemsPage";
import ItemPage from "./pages/ItemPage";
import MyItemsPage from "./pages/MyItemsPage";
import AddItemPage from "./pages/AddItemPage";
import Authenticate from "./pages/Authenticate";
import AuthContext from "./utils/AuthContext";
import { EditModalContextProvider } from "./utils/EditModalContext";

import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

let logoutTimer;

function App() {
  // used because otherwise routes arent rendered correctly
  // with this the page isnt rendered before localStorage is read
  // for example if you refresh the page on the my items page when logged in
  // you get the error page if this state isnt used
  const [localStorageRead, setLocalStorageRead] = useState(false);

  // states used for authorization
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState(null);

  const login = useCallback((uid, authToken, expirationDate) => {
    setUserId(uid);
    setToken(authToken);
    // if no expiry yet: current date + 1h
    const newTokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);

    setTokenExpirationDate(newTokenExpirationDate);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        uid,
        authToken,
        expiration: newTokenExpirationDate.toISOString(),
      }),
    );
  }, []);

  const logout = useCallback(() => {
    setUserId(null);
    setToken(null);
    setTokenExpirationDate(null);
    localStorage.removeItem("userData");
  }, []);

  // check if user has valid token in localStorage and use it to login
  useEffect(() => {
    const storedUserData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedUserData &&
      storedUserData.authToken &&
      new Date(storedUserData.expiration) > new Date()
    ) {
      login(
        storedUserData.uid,
        storedUserData.authToken,
        new Date(storedUserData.expiration),
      );
    }
    setLocalStorageRead(true);
  }, [login]);

  // logout the user when expirationDate has passed
  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  let routes;

  // routes if logged in
  if (token) {
    routes = [
      { index: true, element: <AllItemsPage /> },
      { path: "/item/:itemId", element: <ItemPage /> },
      { path: "/myitems", element: <MyItemsPage /> },
      { path: "/add", element: <AddItemPage /> },
    ];
  } else {
    // routes if not logged in
    routes = [
      { index: true, element: <AllItemsPage /> },
      { path: "/item/:itemId", element: <ItemPage /> },
      { path: "/auth", element: <Authenticate /> },
    ];
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: routes,
    },
  ]);

  const authContextValue = useMemo(
    () => ({
      isLoggedIn: !!token,
      token,
      userId,
      login,
      logout,
    }),
    [token, userId, login, logout],
  );

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="colored"
      />
      {localStorageRead && (
        <EditModalContextProvider>
          <AuthContext.Provider value={authContextValue}>
            <QueryClientProvider client={queryClient}>
              <RouterProvider router={router} />
            </QueryClientProvider>
          </AuthContext.Provider>
        </EditModalContextProvider>
      )}
    </>
  );
}

export default App;
