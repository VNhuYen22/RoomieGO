import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SockJS from "sockjs-client";
import { over } from "stompjs";
import SearchBar from "../components/other/SearchBar";
import axios from "axios";

var stompClient = null;

const ChatPage2 = () => {
  const location = useLocation();
  const [selectedUser, setSelectedUser] = useState(location.state?.selectedUser || null);
  const [receiver, setReceiver] = useState(location.state?.selectedUser?.email || "");
  const [message, setMessage] = useState("");
  const [media, setMedia] = useState("");
  const [tab, setTab] = useState(location.state?.selectedUser?.email || "CHATROOM");
  const [publicChats, setPublicChats] = useState([]);
  const [privateChats, setPrivateChats] = useState(new Map());
  const [chatUsers, setChatUsers] = useState(new Map());
  const [username] = useState(localStorage.getItem("chat-username"));
  const navigate = useNavigate();
  const connected = useRef(false);

  useEffect(() => {
    if (!connected.current) {
      connect();
    }
    // Tải lịch sử chat public khi component mount
    fetchPublicChatHistory();
    return () => {
      if (stompClient) {
        stompClient.disconnect();
        connected.current = false;
      }
    };
  }, []);

  useEffect(() => {
    if (location.state?.selectedUser) {
      const user = location.state.selectedUser;
      if (!user.email) {
        console.error("Selected user has no email");
        return;
      }
      
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found");
        navigate("/login");
        return;
      }

      handlePrivateMessage(user);
      if (username) {
        fetchChatHistory(username, user.email);
      }
    }
  }, [location.state?.selectedUser]);

  const handlePrivateMessage = (user) => {
    if (!user || !user.email) {
      console.error("Invalid user data:", user);
      return;
    }

    setSelectedUser(user);
    setReceiver(user.email);
    setTab(user.email);

    setChatUsers(prev => {
      const newMap = new Map(prev);
      newMap.set(user.email, user);
      return newMap;
    });

    if (!privateChats.has(user.email)) {
      privateChats.set(user.email, []);
      setPrivateChats(new Map(privateChats));
      if (username) {
        fetchChatHistory(username, user.email);
      }
    }
  };

  const onMessageReceived = (payload) => {
    const payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case "JOIN":
        if (!privateChats.has(payloadData.senderName)) {
          privateChats.set(payloadData.senderName, []);
          setPrivateChats(new Map(privateChats));
        }
        break;
      case "LEAVE":
        if (payloadData.senderName !== username) {
          if (privateChats.has(payloadData.senderName)) {
            privateChats.delete(payloadData.senderName);
            setPrivateChats(new Map(privateChats));
          }
        }
        break;
      case "MESSAGE":
        setPublicChats((prev) => [...prev, payloadData]);
        break;
      default:
        break;
    }
  };

  const onPrivateMessage = (payload) => {
    console.log("Received private message:", payload);
    const payloadData = JSON.parse(payload.body);
    
    if (payloadData.status === "JOIN") {
      if (!privateChats.has(payloadData.senderName)) {
        privateChats.set(payloadData.senderName, []);
      }
    } else if (payloadData.status === "MESSAGE") {
      if (!privateChats.has(payloadData.senderName)) {
        privateChats.set(payloadData.senderName, []);
      }
      const messages = privateChats.get(payloadData.senderName);
      messages.push(payloadData);
      privateChats.set(payloadData.senderName, messages);
      setPrivateChats(new Map(privateChats));
    }
  };

  const onConnect = () => {
    connected.current = true;
    stompClient.subscribe("/chatroom/public", onMessageReceived);
    stompClient.subscribe(`/user/${username}/private`, onPrivateMessage);
    userJoin();
  };

  const onError = (err) => {
    console.error("WebSocket connection error:", err);
  };

  const connect = () => {
    let sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(sock);
    stompClient.connect({}, onConnect, onError);
  };

  const userJoin = () => {
    let chatMessage = {
      senderName: username,
      status: "JOIN",
    };
    stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
  };

  const userLeft = () => {
    let chatMessage = {
      senderName: username,
      status: "LEAVE",
    };
    stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
  };

  const handleLogout = () => {
    userLeft();
    localStorage.removeItem("chat-username");
    navigate("/login");
  };

  const base64ConversionForImages = (e) => {
    if (e.target.files[0]) {
      getBase64(e.target.files[0]);
    }
  };

  const getBase64 = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => setMedia(reader.result);
    reader.onerror = (error) => console.error("Error converting file:", error);
  };

  const generateConversationId = (user1Id, user2Id) => {
    const sortedIds = [user1Id, user2Id].sort();
    return `conv_${sortedIds.join('_')}`;
  };

  const sendMessage = async () => {
    if (message.trim().length > 0 || media) {
      const senderId = localStorage.getItem("userId");
      const chatMessage = {
        senderId: senderId,
        senderName: username,
        receiverName: null,
        message: message,
        media: media,
        status: "MESSAGE",
        type: "PUBLIC",
        conversationId: "public_chat"
      };
      stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
      setMessage("");
      setMedia("");
    }
  };

  const sendPrivate = async () => {
    if (message.trim().length > 0 && receiver && selectedUser) {
      const senderId = localStorage.getItem("userId");
      const chatMessage = {
        senderName: username,
        senderId: senderId,
        receiverName: selectedUser.email,
        message: message,
        media: media,
        status: "MESSAGE",
        type: "PRIVATE",
        receiverId: selectedUser.id,
        conversationId: generateConversationId(senderId, selectedUser.id)
      };

      if (!privateChats.has(receiver)) {
        privateChats.set(receiver, []);
      }
      privateChats.get(receiver).push(chatMessage);
      setPrivateChats(new Map(privateChats));
      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      setMessage("");
      setMedia("");
    }
  };

  const fetchChatHistory = async (user1, user2) => {
    if (!user1 || !user2) return;

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const response = await axios.get(
        `http://localhost:8080/api/messages/history/${user1}/${user2}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        setPrivateChats((prevChats) => {
          prevChats.set(user2, response.data);
          return new Map(prevChats);
        });
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const fetchPublicChatHistory = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      const response = await axios.get(
        "http://localhost:8080/api/messages/history/public",
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );
      setPublicChats(response.data);
    } catch (error) {
      console.error("Error fetching public chat history:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-[100%]">
      <div className="flex w-full h-full">
        {/* Member List */}
        <div className="flex flex-col p-3 w-[250px] h-[551px] bg-white border-r">
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Danh sách chat</h3>
            <div className="text-sm text-gray-600">Đang đăng nhập: {username}</div>
          </div>
          
          <ul className="list-none space-y-2">
            <li
              key={"chatroom"}
              className={`p-3 cursor-pointer rounded-lg transition-colors ${
                tab === "CHATROOM" 
                  ? "bg-blue-500 text-white" 
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
              onClick={() => {
                setTab("CHATROOM");
                setReceiver("");
                setSelectedUser(null);
              }}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white mr-3">
                  <span className="text-lg">#</span>
                </div>
                <div>
                  <div className="font-medium">Chat Room</div>
                  <div className="text-xs opacity-75">Phòng chat chung</div>
                </div>
              </div>
            </li>

            {[...privateChats.keys()].map((email) => {
              const user = chatUsers.get(email);
              const lastMessage = privateChats.get(email)?.slice(-1)[0];

              return (
                <li
                  key={email}
                  onClick={() => {
                    const currentUser = chatUsers.get(email) || { email: email };
                    handlePrivateMessage(currentUser);
                  }}
                  className={`p-3 cursor-pointer rounded-lg transition-colors ${
                    tab === email 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <img
                        src={user?.avatarUrl || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                        alt={user?.fullName || email}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">
                        {user?.fullName || email}
                      </div>
                      <div className="text-xs opacity-75 truncate">
                        {lastMessage?.message || 'Chưa có tin nhắn'}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col w-[50%] mt-3">
          {/* Chat header */}
          {tab !== "CHATROOM" && selectedUser && (
            <div className="p-3 bg-white border-b flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <img
                  src={selectedUser.avatarUrl || 'https://randomuser.me/api/portraits/lego/1.jpg'}
                  alt={selectedUser.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="font-medium">{selectedUser.fullName}</div>
                <div className="text-sm text-gray-600">
                  {selectedUser.job || 'Chưa cập nhật nghề nghiệp'}
                </div>
              </div>
            </div>
          )}

          {/* Chat Box */}
          <div
            className="p-3 flex-grow overflow-hidden bg-gray-300 border border-green-500 flex flex-col space-y-2 rounded-md"
            style={{ height: "500px" }}
          >
            {tab === "CHATROOM"
              ? publicChats.map((message, index) => (
                  <div
                    className={`flex ${
                      message.senderName !== username
                        ? "justify-start"
                        : "justify-end"
                    }`}
                    key={index}
                  >
                    <div
                      className={`p-2 flex flex-col max-w-lg ${
                        message.senderName !== username
                          ? "bg-white rounded-t-lg rounded-r-lg"
                          : "bg-blue-500 rounded-t-lg rounded-l-lg"
                      }`}
                    >
                      {message.senderName !== username && (
                        <div className="rounded bg-blue-400 mb-2 p-1 text-white">
                          {message.senderName}
                        </div>
                      )}
                      <div
                        className={
                          message.senderName === username ? "text-white" : ""
                        }
                      >
                        {message.message}
                      </div>
                      {message.media &&
                        message.media
                          .split(";")[0]
                          .split("/")[0]
                          .split(":")[1] === "image" && (
                          <img src={message.media} alt="" width={"250px"} />
                        )}
                      {message.media &&
                        message.media
                          .split(";")[0]
                          .split("/")[0]
                          .split(":")[1] === "video" && (
                          <video width="320" height="240" controls>
                            <source src={message.media} type="video/mp4" />
                          </video>
                        )}
                    </div>
                  </div>
                ))
              : privateChats.get(tab)?.map((message, index) => (
                  <div
                    className={`flex ${
                      message.senderName !== username
                        ? "justify-start"
                        : "justify-end"
                    }`}
                    key={index}
                  >
                    <div
                      className={`p-2 flex flex-col max-w-lg ${
                        message.senderName !== username
                          ? "bg-white rounded-t-lg rounded-r-lg"
                          : "bg-blue-500 rounded-t-lg rounded-l-lg"
                      }`}
                    >
                      <div
                        className={
                          message.senderName === username ? "text-white" : ""
                        }
                      >
                        {message.message}
                      </div>
                      {message.media &&
                        message.media
                          .split(";")[0]
                          .split("/")[0]
                          .split(":")[1] === "image" && (
                          <img src={message.media} alt="" width={"250px"} />
                        )}
                      {message.media &&
                        message.media
                          .split(";")[0]
                          .split("/")[0]
                          .split(":")[1] === "video" && (
                          <video width="320" height="240" controls>
                            <source src={message.media} type="video/mp4" />
                          </video>
                        )}
                    </div>
                  </div>
                ))}
          </div>

          {/* Message Box */}
          <div className="flex items-center p-2">
            <input
              className="flex-grow p-2 border outline-blue-600 rounded-l-lg"
              type="text"
              placeholder="Message"
              value={message}
              onKeyUp={(e) => {
                if (e.key === "Enter" || e.key === 13) {
                  tab === "CHATROOM" ? sendMessage() : sendPrivate();
                }
              }}
              onChange={(e) => setMessage(e.target.value)}
            />
            <label
              htmlFor="file"
              className="p-2 bg-blue-700 text-white rounded-r-none cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="24"
                fill="currentColor"
                className="bi bi-paperclip"
                viewBox="0 0 16 16"
              >
                <path d="M4.5 3a2.5 2.5 0 0 1 5 0v9a1.5 1.5 0 0 1-3 0V5a.5.5 0 0 1 1 0v7a.5.5 0 0 0 1 0V3a1.5 1.5 0 1 0-3 0v9a2.5 2.5 0 0 0 5 0V5a.5.5 0 0 1 1 0v7a3.5 3.5 0 1 1-7 0V3z" />
              </svg>
            </label>
            <input
              id="file"
              type="file"
              onChange={(e) => base64ConversionForImages(e)}
              className="hidden"
            />
            <input
              type="button"
              className="ml-2 p-2 bg-blue-700 text-white rounded cursor-pointer"
              value="Send"
              onClick={tab === "CHATROOM" ? sendMessage : sendPrivate}
            />
            <input
              type="button"
              className="ml-2 p-2 bg-blue-700 text-white rounded cursor-pointer"
              value="Logout"
              onClick={handleLogout}
            />
          </div>
        </div>
        <div className="pl-4 pt-3">
          <SearchBar onUserSelect={handlePrivateMessage} />
        </div>
      </div>
    </div>
  );
};

export default ChatPage2;