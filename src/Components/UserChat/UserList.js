import React, { useState } from "react";
import { Avatar, Box, Typography } from "@mui/material";

const UserListItem = ({ handleFunction, user }) => {
  const [bgColor, setBgColor] = useState("#E8E8E8");
  const [txtColor, setTxtColor] = useState("#000");

  const stringToColor = (string) => {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  };

  const stringAvatar = (name) => {
    const splitName = name.split(" ");
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${
        splitName.length > 1
          ? splitName[0][0] + name.split(" ")[1][0]
          : splitName[0][0]
      }`,
    };
  };

  return (
    <Box
      onClick={handleFunction}
      sx={{
        cursor: "pointer",
        background: bgColor,
        width: "95%",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 2,
        p: 1,
        mt: 1,
        mb: 2,
        borderRadius: "8px",
        display: "flex",
        color: txtColor,
      }}
      onMouseEnter={() => {
        setBgColor("#38B2AC");
        setTxtColor("#fff");
      }}
      onMouseLeave={() => {
        setBgColor("#E8E8E8");
        setTxtColor("#000 ");
      }}
    >
      <Avatar {...stringAvatar(user.name)} src={user.pic} />
      <Box style={{ textAlign: "left" }}>
        <Typography>{user.name}</Typography>
        <Typography fontSize="xs">
          <b>Email: </b>
          {user.email}
        </Typography>
      </Box>
    </Box>
  );
};

export default UserListItem;
