import React, { useContext } from "react";
import { useQuery } from "react-query";
import { Button, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AuthContext from "../utils/AuthContext";
import { getItemsByUserId } from "../api/items";
import Item from "../components/Item";
import "./MyItemsPage.css";

function MyItemsPage() {
  const auth = useContext(AuthContext);

  const { isLoading, error, data } = useQuery("allItems", () => {
    return getItemsByUserId(auth.userId, auth.token);
  });

  if (isLoading) {
    return (
      <>
        <h1>MY ITEMS PAGE</h1>
        <div>
          <CircularProgress size={80} color="warning" />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <h1>MY ITEMS PAGE</h1> <h2>An error has occurred: {error.message}</h2>
      </>
    );
  }

  return (
    <>
      <h1>MY ITEMS PAGE</h1>
      <div className="main-container">
        {data.map((item) => (
          <div className="myitem-container" key={item.id}>
            <Item item={item} />
            <div className="edit-buttons">
              <Button
                variant="contained"
                size="large"
                startIcon={<EditIcon />}
                sx={{ m: 2 }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                size="large"
                color="error"
                endIcon={<DeleteIcon />}
                sx={{ m: 2 }}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default MyItemsPage;
