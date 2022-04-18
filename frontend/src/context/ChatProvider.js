import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContetx = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));

    setUser(userData);

    if (!userData) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <ChatContetx.Provider value={{ user, setUser }}>
      {children}
    </ChatContetx.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContetx);
};
export default ChatProvider;
