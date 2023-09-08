import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { ChatContext } from "../../Context/ChatProvider";
import useAlert from "../Alert/useAlert";
import UserTagItem from "../UserChat/UserTagItem";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserChat/UserList";

const UpdateGroupChatModal = ({
  open,
  handleClose,
  fetchAgain,
  setFetchAgain,
  fetchMessages,
}) => {
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { showAlert, AlertComponent } = useAlert();

  const { selectedChat, setSelectedChat, user } = useContext(ChatContext);

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

  const handleRemove = (userToRemove) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToRemove._id !== user._id
    ) {
      showAlert("error", "Only admins can remove someone");
    }

    setLoading(true);

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    axios
      .put(
        "https://chatterbox-backend-5x94.onrender.com/api/chat/removeUser",
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        config
      )
      .then((res) => {
        userToRemove._id === user._id
          ? setSelectedChat()
          : setSelectedChat(res.data);
        setFetchAgain(!fetchAgain);
        fetchMessages();
        setSearch("");
      })
      .catch((err) => showAlert("error", "Error Occured!"))
      .finally(() => setLoading(false));
  };

  const handleRename = () => {
    if (!groupChatName) {
      return;
    }
    setRenameLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    axios
      .put(
        "https://chatterbox-backend-5x94.onrender.com/api/chat/renameGroup",
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      )
      .then((res) => {
        setSelectedChat(res.data);
        setFetchAgain(!fetchAgain);
      })
      .catch((err) => showAlert("error", "Failed to rename group chat name"))
      .finally(() => setRenameLoading(false));

    setGroupChatName("");
  };

  const handleSearch = (value) => {
    setSearch(value);
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

  const handleAddUser = (userToAdd) => {
    if (
      selectedChat.users.some(
        (selectedUser) => selectedUser._id === userToAdd._id
      )
    ) {
      showAlert("error", "User Already in the Group");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      showAlert("error", "Only admins can add someone!");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    setLoading(true);
    axios
      .put(
        "https://chatterbox-backend-5x94.onrender.com/api/chat/addToGroup",
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      )
      .then((res) => {
        setSelectedChat(res.data);
        setSearch("");
        setSearchResult([]);
        setFetchAgain(!fetchAgain);
      })
      .catch((err) => showAlert("error", "Error Occured!"))
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {selectedChat.chatName}
          </Typography>
          <Box id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
            {selectedChat.users.map((selectedUser) => (
              <UserTagItem
                key={selectedUser._id}
                user={selectedUser}
                handleFunction={() => handleRemove(selectedUser)}
              />
            ))}
            <Box
              sx={{
                width: "100%",
                height: "40px",
                display: "flex",
                gap: 1,
                mt: 1,
              }}
            >
              <TextField
                fullWidth
                placeholder="Chat Name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                size="small"
              />
              <Button
                variant="contained"
                loading={renameLoading}
                onClick={handleRename}
                sx={{ background: "teal" }}
              >
                Update
              </Button>
            </Box>
            <TextField
              fullWidth
              placeholder="Add User to Group"
              size="small"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              sx={{ mt: 2 }}
            />
          </Box>
          {loading ? (
            <ChatLoading />
          ) : (
            searchResult
              ?.slice(0, 4)
              .map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
          )}
          <Button
            variant="contained"
            sx={{ float: "right" }}
            onClick={() => handleRemove(user)}
            color="error"
          >
            Leave Group
          </Button>
          {AlertComponent}
        </Box>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
