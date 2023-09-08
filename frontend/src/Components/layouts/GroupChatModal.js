import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import useAlert from "../Alert/useAlert";
import { ChatContext } from "../../Context/ChatProvider";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserChat/UserList";
import UserTagItem from "../UserChat/UserTagItem";

const GroupChatModal = ({ open, handleClose }) => {
  const [chatName, setChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, chats, setChats } = useContext(ChatContext);

  const { showAlert, AlertComponent } = useAlert();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  const handleSearch = (value) => {
    if (!value || value === "") {
      setSearchResult([]);
      return;
    }
    setLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    axios
      .get(
        `https://chatterbox-backend-5x94.onrender.com/api/user?search=${value}`,
        config
      )
      .then((res) => setSearchResult(res.data))
      .catch((err) => showAlert("error", "Unable to find the user"))
      .finally(() => setLoading(false));
  };

  const handleGroup = (user) => {
    if (selectedUsers.some((selectedUser) => selectedUser._id === user._id)) {
      showAlert("warning", "User Already Added");
      return;
    }
    setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, user]);
  };

  const handleDelete = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
  };

  const handleSubmit = () => {
    if (!chatName || !selectedUsers || selectedUsers.length === 0) {
      showAlert("warning", "Please fill all the fields");
      return;
    }
    if (selectedUsers.length < 2) {
      showAlert("warning", "Selected Users should be more than 1");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    axios
      .post(
        "https://chatterbox-backend-5x94.onrender.com/api/chat/group",
        {
          name: chatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      )
      .then((res) => {
        setChats([res.data, ...chats]);
        handleClose();
        setChatName("");
        setSelectedUsers([]);
        setSearchResult([]);
      })
      .catch((err) => showAlert("error", "Failed to create the chat"));
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Create Group Chat
        </Typography>
        <Box id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
          <TextField
            placeholder="Chat Name"
            sx={{ mb: 2 }}
            fullWidth
            onChange={(e) => setChatName(e.target.value)}
            value={chatName}
          />
          <TextField
            placeholder="Add Users eg: John, Sumant, Sameeksha"
            fullWidth
            onChange={(e) => handleSearch(e.target.value)}
          />
          {selectedUsers.map((addedUser) => (
            <UserTagItem
              key={addedUser._id}
              user={addedUser}
              handleFunction={() => handleDelete(addedUser)}
            />
          ))}
          {loading ? (
            <ChatLoading />
          ) : (
            searchResult
              ?.slice(0, 4)
              .map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
          )}
        </Box>
        <Button
          variant="contained"
          sx={{ float: "right" }}
          onClick={handleSubmit}
        >
          Create Chat
        </Button>
        {AlertComponent}
      </Box>
    </Modal>
  );
};

export default GroupChatModal;
