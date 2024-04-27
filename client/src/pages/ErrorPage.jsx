import React from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";

function ErrorPage() {
  return (
    <>
      <MainNavigation />
      <h1>Oops, something went wrong!</h1>
      <p>Couldnt find the page that you were looking for! </p>
      <Link to="/">
        <Button variant="contained" size="large" color="warning">
          Go back to the frontpage
        </Button>
      </Link>
    </>
  );
}

export default ErrorPage;
