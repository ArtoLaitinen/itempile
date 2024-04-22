import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";
import AuthContext from "../utils/AuthContext";

import "./MainNavigation.css";

function MainNavigation() {
  const auth = useContext(AuthContext);
  const [openDrawer, setOpenDrawer] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 810px)");
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const logoutHandler = () => {
    auth.logout();
    navigate("/");
  };

  const drawerContent = (
    <div>
      <List
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <ListItem component={Link} to="/add">
          <ListItemText primary="Add an Item" />
        </ListItem>

        <ListItem component={Link} to="/myitems">
          <ListItemText primary="My Items" />
        </ListItem>

        <ListItem component={Link} to="/auth">
          <ListItemText primary="Authenticate" />
        </ListItem>

        <ListItem component={Button} onClick={logoutHandler}>
          <ListItemText primary="Log out" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <header className="header">
      <h3 className="logo">
        <Link to="/">Itempile</Link>
      </h3>

      {isSmallScreen ? (
        <div className="nav-links">
          <IconButton
            color="warning"
            onClick={toggleDrawer}
            sx={{ marginRight: 2 }}
          >
            <MenuIcon fontSize="large" />
          </IconButton>
        </div>
      ) : (
        <div className="nav-links">
          <h3 className="nav-item">
            <Link to="/add">Add an Item</Link>
          </h3>

          <h3 className="nav-item">
            <Link to="/myitems">My Items</Link>
          </h3>

          <h3 className="nav-item">
            <Link to="/auth">Authenticate</Link>
          </h3>

          <Button
            variant="contained"
            color="warning"
            onClick={logoutHandler}
            sx={{ height: "60%" }}
          >
            Log out
          </Button>
        </div>
      )}

      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={toggleDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: "#333",
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </header>
  );
}

export default MainNavigation;
