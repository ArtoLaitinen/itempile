import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import CircularProgress from "@mui/material/CircularProgress";
import { getItemById } from "../api/items";

import "./ItemPage.css";

function ItemPage() {
  const { itemId } = useParams();

  useEffect(() => {
    // making sure that the top of the page is shown
    window.scrollTo(0, 0);
  }, []);

  const { isLoading, error, data } = useQuery("itemById", () => {
    return getItemById(itemId);
  });

  if (isLoading) {
    return (
      <div>
        <CircularProgress size={80} color="warning" />
      </div>
    );
  }

  if (error) {
    return <h2>An error has occurred, please try again</h2>;
  }

  console.log(data);

  return <h1>ITEM PAGE</h1>;
}

export default ItemPage;
