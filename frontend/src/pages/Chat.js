import { Box } from "@chakra-ui/react";
import React from "react";
import ChatBox from "../components/ChatBox";
import SideBar from "../components/Miscellaneous/SideBar";
import MyChats from "../components/MyChats";
import { ChatState } from "../context/ChatProvider";

const Chat = () => {
  const { user } = ChatState();
  return (
    <div style={{ width: "100%" }}>
      {user && <SideBar />}

      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default Chat;
