import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RootLayout from "./pages/RootLayout";
import AllItemsPage from "./pages/AllItemsPage";
import ItemPage from "./pages/ItemPage";
import Authenticate from "./pages/Authenticate";
import AuthContext from "./utils/AuthContext";

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
      storedUserData.token &&
      new Date(storedUserData.expiration) > new Date()
    ) {
      login(
        storedUserData.uid,
        storedUserData.token,
        new Date(storedUserData.expiration),
      );
    }
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

  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <AllItemsPage /> },
        { path: "/item/:itemId", element: <ItemPage /> },
        { path: "/auth", element: <Authenticate /> },
      ],
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
      <AuthContext.Provider value={authContextValue}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AuthContext.Provider>
    </>
  );
}

export default App;
