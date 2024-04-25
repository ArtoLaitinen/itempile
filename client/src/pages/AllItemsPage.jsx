import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import CircularProgress from "@mui/material/CircularProgress";
import { getItems } from "../api/items";
import Item from "../components/Item";

import "./AllItemsPage.css";

function AllItemsPage() {
  const navigate = useNavigate();

  const handleItemClick = (itemId) => {
    navigate(`/item/${itemId}`);
  };

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
          <div
            className="item-container"
            key={item.id}
            role="button"
            onClick={() => handleItemClick(item.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleItemClick(item.id);
              }
            }}
            tabIndex={0}
            aria-label="View item"
            data-testid="item"
          >
            <Item item={item} />
          </div>
        ))}
      </div>
    </>
  );
}

export default AllItemsPage;
