import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../Context/ChatProvider";
import axios from "axios";
import useAlert from "./Alert/useAlert";
import { Box, Button, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ChatLoading from "./ChatLoading";
import { getSender } from "../Config/ChatLogics";
import GroupChatModal from "./layouts/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, setSelectedChat, selectedChat, chats, setChats } =
    useContext(ChatContext);
  const { showAlert, AlertComponent } = useAlert();

  const fetchChats = () => {
    setLoading(true);
    const config = {
      headers: { Authorization: `Bearer ${user.token}` },
    };
    axios
      .get("https://chatterbox-backend-5x94.onrender.com/api/chat", config)
      .then((res) => setChats(res.data))
      .catch((err) => showAlert("error", "Error Occured"))
      .finally(() => setLoading(false));
  };

  const handleClose = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("info")));
    setChats([]);
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "18px 18px 0px",
        background: "#fff",
        width: "31%",
        borderRadius: "10px",
        borderWidth: "1px",
      }}
    >
      <Box
        sx={{
          padding: "0px 18px 18px",
          fontSize: "26px",
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        My Chats
        <Button startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          New Group Chat
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 2,
          background: "#F8F8F8",
          width: "100%",
          height: "100%",
          borderRadius: "10px",
        }}
      >
        {chats.length > 0 ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                sx={{
                  cursor: "pointer",
                  background: selectedChat === chat ? "#38B2AC" : "#E8E8E8",
                  color: selectedChat === chat ? "#fff" : "#000",
                  padding: 2,
                  borderRadius: "10px",
                  mb: 1,
                }}
                key={chat._id}
              >
                <Typography variant="h6">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Typography>
              </Box>
            ))}
          </Stack>
        ) : (
          !loading && (
            <Box
              sx={{
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Typography variant="h4">
                Welcome to Chatter-Box. Let's Start a New Chat
              </Typography>
            </Box>
          )
        )}
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <ChatLoading />
          </Box>
        )}
      </Box>
      <GroupChatModal open={open} handleClose={handleClose} />
      {AlertComponent}
    </Box>
  );
};

export default MyChats;
