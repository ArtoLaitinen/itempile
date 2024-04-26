import React from "react";
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Item from "../components/Item";
import "./MyItemsPage.css";

function MyItemsPage() {
  const data = [
    {
      id: 1,
      title: "test1",
      description: "test desc",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/1/1d/Football_Pallo_valmiina-cropped.jpg",
      category: "test category",
      price: "123",
      owner_id: "2bfd3e62-6fd4-48bf-be7e-f694f880b10e",
      created: "2024-04-26T06:48:03.000Z",
      updated: "2024-04-26T06:48:03.000Z",
      user_name: "dev1",
      user_email: "dev@gmail.com",
    },
    {
      id: 2,
      title: "test2",
      description: "test desc",
      image:
        "https://thefootballheritage.com/wp-content/uploads/2023/10/cf304ccd.jpg",
      category: "test category",
      price: "123",
      owner_id: "6eb7a265-d3c1-4780-88cd-54ea3bc7ab59",
      created: "2024-04-26T06:48:03.000Z",
      updated: "2024-04-26T06:48:03.000Z",
      user_name: "dev2",
      user_email: "dev@gmail.com",
    },
    {
      id: 3,
      title: "Sofa",
      description: "test desc",
      image: "https://live.staticflickr.com/4082/4822322673_c6edb296f2_b.jpg",
      category: "test category",
      price: "123",
      owner_id: "2bfd3e62-6fd4-48bf-be7e-f694f880b10e",
      created: "2024-04-26T06:48:03.000Z",
      updated: "2024-04-26T06:48:03.000Z",
      user_name: "dev1",
      user_email: "dev@gmail.com",
    },
    {
      id: 4,
      title: "PC",
      description: "test desc",
      image:
        "https://www.trustedreviews.com/wp-content/uploads/sites/54/2023/01/AlphaSync-PBA-Diamond-Gaming-Desktop-PC-16.jpg",
      category: "test category",
      price: "123",
      owner_id: "2bfd3e62-6fd4-48bf-be7e-f694f880b10e",
      created: "2024-04-26T06:48:03.000Z",
      updated: "2024-04-26T06:48:03.000Z",
      user_name: "dev1",
      user_email: "dev@gmail.com",
    },
  ];

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
