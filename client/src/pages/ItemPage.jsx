import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import "./ItemPage.css";

function ItemPage() {
  const { itemId } = useParams();

  useEffect(() => {
    // making sure that the top of the page is shown
    window.scrollTo(0, 0);
  }, []);

  console.log(itemId);

  return <h1>ITEM PAGE</h1>;
}

export default ItemPage;
