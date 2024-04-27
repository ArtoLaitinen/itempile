import React, { useContext } from "react";
import { useMutation, useQuery } from "react-query";
import { Button, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../utils/AuthContext";
import { deleteItem, getItemsByUserId } from "../api/items";
import Item from "../components/Item";
import "./MyItemsPage.css";

function MyItemsPage() {
  const auth = useContext(AuthContext);

  const { isLoading, error, data, refetch } = useQuery(
    "itemsByUser",
    () => {
      return getItemsByUserId(auth.userId, auth.token);
    },
    {
      retry: 0,
    },
  );

  const deleteItemMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      refetch();
    },
    onError: () => {
      toast.error("Failed to delete the item, try again later");
    },
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
        <h1>MY ITEMS PAGE</h1> <h2>{error.message}</h2>
      </>
    );
  }

  const handleDelete = (itemId) => {
    if (
      window.confirm(
        "This action will delete the item from itempile! Are you sure?",
      )
    ) {
      deleteItemMutation.mutate({
        itemId,
        token: auth.token,
      });
    }
  };

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
                onClick={() => handleDelete(item.id)}
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
