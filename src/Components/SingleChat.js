import React, { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../Context/ChatProvider";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Typography,
  styled,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getSender, getSenderFull } from "../Config/ChatLogics";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ProfileModal from "./layouts/ProfileModal";
import UpdateGroupChatModal from "./layouts/UpdateGroupChatModal";
import useAlert from "./Alert/useAlert";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";

const ENDPOINT = "https://chatterbox-backend-5x94.onrender.com";
var socket, selectedChatCompare;

const ChattingBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  overflowY: "scroll",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": {
    display: "none",
  },
  "&-ms-overflow-style:": {
    display: "none",
  },
  height: "auto",
});

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    useContext(ChatContext);
  const [openUserProfile, setOpenUserProfile] = useState(false);
  const [openGroupProfile, setOpenGroupProfile] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollToBottomRef = useRef(null);
  const { showAlert, AlertComponent } = useAlert();

  const handleClose = () => {
    setOpenGroupProfile(false);
    setOpenUserProfile(false);
  };

  const openUserProfileModal = () => {
    setOpenUserProfile(true);
  };

  const openGroupProfileModal = () => {
    setOpenGroupProfile(true);
  };

  const sendMessage = (e) => {
    if ((e.key === "Enter" || e.type === "click") && newMessage) {
      socket.emit("stop typing", selectedChat._id);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const data = {
        content: newMessage,
        chatId: selectedChat._id,
      };

      setNewMessage("");
      axios
        .post(
          "https://chatterbox-backend-5x94.onrender.com/api/message/",
          data,
          config
        )
        .then((res) => {
          socket.emit("new message", res.data);
          setMessages([...messages, res.data]);
        })
        .catch((err) => showAlert("error", "Failed to send the message"));
    }
  };

  const fetchMessages = () => {
    if (!selectedChat) {
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
        `https://chatterbox-backend-5x94.onrender.com/api/message/${selectedChat._id}`,
        config
      )
      .then((res) => {
        setMessages(res.data);
        socket.emit("join chat", selectedChat._id);
      })
      .catch((err) => showAlert("error", "Failed to Load the Messages "))
      .finally(() => setLoading(false));
  };

  const messageTypingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) {
      return;
    }

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    let timerLength = 5000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  useEffect(() => {
    setSelectedChat();
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    if (isTyping && scrollToBottomRef.current) {
      const container = scrollToBottomRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [isTyping]);

  useEffect(() => {
    socket.on("message recieved", (newMsgRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMsgRecieved.chat._id
      ) {
        // give notification
        if (!notification.includes(newMsgRecieved)) {
          setNotification([newMsgRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMsgRecieved]);
      }
    });
  });

  return (
    <>
      {selectedChat ? (
        <>
          <Box
            sx={{
              pb: 2,
              px: 2,
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <IconButton
              sx={{
                display: "none",
                background: "#e1e0e0",
                borderRadius: "10px",
              }}
              onClick={() => setSelectedChat()}
            >
              <ArrowBackIcon variant="outlined" />
            </IconButton>
            {!selectedChat.isGroupChat ? (
              <Typography variant="h5">
                {getSender(user, selectedChat.users).toUpperCase()}
              </Typography>
            ) : (
              <Typography variant="h5">
                {selectedChat.chatName.toUpperCase()}
              </Typography>
            )}
            <IconButton
              onClick={
                selectedChat.isGroupChat
                  ? openGroupProfileModal
                  : openUserProfileModal
              }
              sx={{ background: "#e1e0e0", borderRadius: "10px" }}
            >
              <VisibilityIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              p: 2,
              background: "#E8E8E8",
              width: "100%",
              height: "100%",
              borderRadius: "10px",
              overflowY: "hidden",
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                <CircularProgress size={70} thickness={3} />
              </Box>
            ) : (
              <>
                <ChattingBox ref={scrollToBottomRef}>
                  <ScrollableChat messages={messages} />
                </ChattingBox>
                {isTyping && (
                  <Box
                    sx={{
                      width: "fit-content",
                      height: "29px",
                      ml: 3,
                      mt: "3px",
                      p: 1,
                      position: "block",
                      color: "teal",
                      background: "#CAF2E1",
                      opacity: "0.5",
                      overflowX: "none",
                    }}
                  >
                    <Typography>{`${getSender(
                      user,
                      selectedChat.users
                    )} is typing...`}</Typography>
                  </Box>
                )}
                <OutlinedInput
                  id="outlined-adornment-password"
                  fullWidth
                  placeholder="Enter a message..."
                  type="text"
                  onKeyDown={sendMessage}
                  onChange={messageTypingHandler}
                  endAdornment={
                    <InputAdornment position="end">
                      <Button
                        variant="contained"
                        sx={{ background: "teal" }}
                        onClick={sendMessage}
                      >
                        Send
                      </Button>
                    </InputAdornment>
                  }
                  value={newMessage}
                  sx={{ mt: 2 }}
                />
              </>
            )}
          </Box>
          <ProfileModal
            open={openUserProfile}
            handleClose={handleClose}
            user={getSenderFull(user, selectedChat.users)}
          />
          <UpdateGroupChatModal
            open={openGroupProfile}
            handleClose={handleClose}
            fetchAgain={fetchAgain}
            setFetchAgain={setFetchAgain}
            fetchMessages={fetchMessages}
          />
        </>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4">
            Click on a user to start chatting
          </Typography>
        </Box>
      )}
      {AlertComponent}
    </>
  );
};

export default SingleChat;
