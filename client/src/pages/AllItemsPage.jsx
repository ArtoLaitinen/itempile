import React from "react";
import { useQuery } from "react-query";
import CircularProgress from "@mui/material/CircularProgress";
import { getItems } from "../api/items";

function AllItemsPage() {
  const { isLoading, error, data } = useQuery("allItems", () => {
    return getItems();
  });

  // eslint-disable-next-line no-console
  console.log(data);

  if (isLoading) {
    return (
      <>
        <h1>ITEMS</h1>
        <div>
          <CircularProgress size={80} color="warning" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <h1>ITEMS</h1> <h2>An error has occurred: {error.message}</h2>
      </>
    );
  }

  return <h1>ITEMS</h1>;
}

export default AllItemsPage;
