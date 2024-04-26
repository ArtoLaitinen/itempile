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
    return <h2>An error has occurred: {error.message}</h2>;
  }

  return (
    <>
      <h1 className="item-title">{data.title}</h1>
      <div className="main-container">
        <div className="item-page-image-container">
          <img src={data.image} alt={data.image} />
        </div>

        <div className="item-page-details-container">
          <div className="item-info">
            <h2>
              <span className="info-label">Price:</span> {data.price} €
            </h2>
            <h2>
              <span className="info-label">Category:</span> {data.category}
            </h2>
            <p className="item-description">{data.description}</p>
          </div>

          <div className="seller-info">
            <p>
              <span className="info-label">Contact the Seller:</span>
            </p>
            <p>{data.user_name}</p>
            <p>
              <span className="info-label">Email: </span>
              {data.user_email}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ItemPage;
