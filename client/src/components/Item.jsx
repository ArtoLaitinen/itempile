import React from "react";
import "./Item.css";

function Item({ item }) {
  return (
    <>
      <h2 className="item-title-text">{item.title}</h2>

      <h2 className="item-price-text">{item.price} €</h2>

      <div className="image-container">
        <img src={item.image} alt={item.image} />
      </div>
    </>
  );
}

export default Item;
