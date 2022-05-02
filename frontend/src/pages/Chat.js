import { Box } from "@chakra-ui/react";
import React, { useState } from "react";
import ChatBox from "../components/ChatBox";
import SideBar from "../components/Miscellaneous/SideBar";
import MyChats from "../components/MyChats";
import { ChatState } from "../context/ChatProvider";

const Chat = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideBar />}

      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chat;
