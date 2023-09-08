import {
  Avatar,
  Box,
  CircularProgress,
  Drawer,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  MenuList,
  OutlinedInput,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
import useAlert from "../Alert/useAlert";
import axios from "axios";
import { ChatContext } from "../../Context/ChatProvider";
import ChatLoading from "../ChatLoading";
import ProfileModal from "./ProfileModal";
import UserListItem from "../UserChat/UserList";
import { getSender } from "../../Config/ChatLogics";
// import NotificationBadge, { Effect } from "react-notification-badge";

const SideDrawer = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  const navigate = useNavigate();
  const { showAlert, AlertComponent } = useAlert();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = useContext(ChatContext);

  const handleClick = (event) => {
    setOpen(true);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(false);
    setAnchorEl(null);
  };

  const handleClickNotification = (event) => {
    setOpenNotification(true);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseNotification = () => {
    setOpenNotification(false);
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("info");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      showAlert("warning", "Please Enter something in search box");
      return;
    }

    setLoading(true);
    const config = {
      headers: { Authorization: `Bearer ${user.token}` },
    };

    await axios
      .get(
        `https://chatterbox-backend-5x94.onrender.com/api/user?search=${search}`,
        config
      )
      .then((res) => {
        setSearchResult(res.data);
      })
      .catch((err) => showAlert("error", "Failed to Load the Search Results"));
    setLoading(false);
  };

  const accessChat = (userId) => {
    setLoadingChat(true);
    const config = {
      "content-type": "application/json",
      headers: { Authorization: `Bearer ${user.token}` },
    };
    axios
      .post(
        "https://chatterbox-backend-5x94.onrender.com/api/chat",
        { userId },
        config
      )
      .then((res) => {
        if (!chats.find((chat) => chat._id === res.data._id)) {
          setChats([res.data, ...chats]);
        }
        setSelectedChat(res.data);
        setOpenDrawer(false);
      })
      .catch((err) =>
        showAlert("error", "Error fetching the chat. Please try again!")
      )
      .finally(() => setLoadingChat(false));
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "white",
          width: "99%",
          padding: "0.5%",
          borderWidth: "5px",
        }}
      >
        <Button
          startIcon={<SearchIcon sx={{ color: "grey" }} />}
          sx={{ color: "grey" }}
          onClick={() => setOpenDrawer(true)}
        >
          Search User
        </Button>

        <Typography variant="h5">Chatter-Box</Typography>
        <Box>
          <IconButton
            id="notification-button"
            size="small"
            sx={{ mr: 2 }}
            aria-controls={openNotification ? "notification-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openNotification ? "true" : undefined}
            onClick={handleClickNotification}
          >
            <Box
              sx={{
                background: "red",
                display: notification.length === 0 ? "none" : "block",
                position: "absolute",
                top: "-2px",
                right: "5px",
                fontSize: "9px",
                color: "#fff",
                padding: "4px",
                borderRadius: "10px",
              }}
            >
              {notification.length}
            </Box>
            <NotificationsIcon sx={{ color: "grey", position: "initial" }} />
          </IconButton>
          <Menu
            id="notification-menu"
            anchorEl={anchorEl}
            open={openNotification}
            onClose={handleCloseNotification}
            MenuListProps={{
              "aria-labelledby": "notification-button",
            }}
          >
            <MenuList sx={{ p: 0 }}>
              {!notification.length && <MenuItem>No New Messages</MenuItem>}
              {notification?.map((msg) => (
                <MenuItem
                  key={msg._id}
                  onClick={() => {
                    setSelectedChat(msg.chat);
                    setNotification(notification.filter((m) => m !== msg));
                  }}
                >
                  {msg.chat.isGroupChat
                    ? `New Message in ${msg.chat.chatName}`
                    : `New Message from ${getSender(user, msg.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Button
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            startIcon={
              <Avatar
                sx={{ cursor: "pointer", width: 24, height: 24 }}
                src={user.pic}
              />
            }
            endIcon={<ArrowDropDownIcon sx={{ color: "grey" }} />}
          />
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={() => setOpenProfile(true)}>My Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Box>
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Box sx={{ padding: "20px", width: "350px" }}>
          <OutlinedInput
            id="outlined-adornment-password"
            type="text"
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleSearch} edge="end">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            }
            placeholder="Search By name or email"
            sx={{ borderRadius: "10px", mb: 3, width: "100%" }}
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          {loading ? (
            <ChatLoading />
          ) : (
            searchResult?.map((userInfo) => (
              <UserListItem
                key={userInfo._id}
                user={userInfo}
                handleFunction={() => accessChat(userInfo._id)}
              />
            ))
          )}
        </Box>
        {loadingChat && (
          <Box
            sx={{ width: "93%", display: "flex", justifyContent: "flex-end" }}
          >
            <CircularProgress size={30} />
          </Box>
        )}
      </Drawer>
      <ProfileModal
        open={openProfile}
        handleClose={() => setOpenProfile(false)}
        user={user}
      />
      {AlertComponent}
    </>
  );
};

export default SideDrawer;
