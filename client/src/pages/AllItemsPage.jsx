import React from "react";
import { useQuery } from "react-query";
import CircularProgress from "@mui/material/CircularProgress";
import { getItems } from "../api/items";
import Item from "../components/Item";

import "./AllItemsPage.css";

function AllItemsPage() {
  const { isLoading, error, data } = useQuery("allItems", () => {
    return getItems();
  });

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

  return (
    <>
      <h1>ITEMS</h1>
      <div className="main-container">
        {data.map((item) => (
          <div className="item-container" key={item.id}>
            <Item item={item} />
          </div>
        ))}
      </div>
    </>
  );
}

export default AllItemsPage;
