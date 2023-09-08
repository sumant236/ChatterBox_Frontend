import { Avatar, Box, Tooltip, Zoom } from "@mui/material";
import React, { useContext } from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameUser,
  isSenderMargin,
} from "../Config/ChatLogics";
import { ChatContext } from "../Context/ChatProvider";
import "./scrollableChat.css";

const ScrollableChat = ({ messages }) => {
  const { user } = useContext(ChatContext);
  return (
    <ScrollableFeed className={"scrollableFeed"}>
      {messages &&
        messages.map((message, i) => (
          <Box
            sx={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
            key={message._id}
          >
            {(isSameSender(messages, message, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip
                title={message.sender.name}
                placement="bottom"
                arrow
                TransitionComponent={Zoom}
              >
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    mt: isSameUser(messages, message, i) ? "3px" : "10px",
                  }}
                  src={message.sender.pic}
                ></Avatar>
              </Tooltip>
            )}
            <span
              style={{
                background:
                  message.sender._id === user._id ? "#BEE3F8" : "#B9F5D0",
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSenderMargin(messages, message, i, user._id),
                marginTop: isSameUser(messages, message, i) ? 3 : 10,
              }}
            >
              {message.content}
            </span>
          </Box>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
