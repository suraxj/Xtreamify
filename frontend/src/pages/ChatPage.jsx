import { useState } from "react";
import { useParams } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api";
import { useEffect } from "react";
import { Channel, ChannelHeader, Chat, MessageInput, MessageList, Thread, Window, } from "stream-chat-react";
import { StreamChat } from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader";

const XTEAM_API_KEY = import.meta.env.VITE_XTEAM_API_KEY;

const ChatPage = () => {
    const { id: targetUserId } = useParams();

    const [chatClient, setChatClient] = useState(null);
    const [channel, setChannel] = useState(null);

    const [loading, setloading] = useState(true);

    const { authUser } = useAuthUser();

    const  {data: tokenData } = useQuery({
        queryKey: ["streamToken"],
        queryFn: getStreamToken,
        enabled: !!authUser // only run if authUser exists
      });

      useEffect(() => {
        const initChat = async () => {
          if (!tokenData?.token || !authUser) return;

          try {
           console.log("Initializing stream chat client ...");

           const client = StreamChat.getInstance(XTEAM_API_KEY);

           await client.connectUser({
            id: authUser._id,
            name: authUser.fullname,
            image: authUser.profilePic,
           }, tokenData.token);

           const channelId = [authUser._id, targetUserId].sort().join("-");

           const currChannel = client.channel("messaging", channelId, {
            members: [authUser._id, targetUserId],
           });

              await currChannel.watch();

              setChatClient(client);
                setChannel(currChannel);
            
          } catch (error) {
            console.error("Error initializing Stream chat client:", error);
            toast.error("Could not initialize chat. Please try again.");
          } finally{
            setloading(false);
          }
        }
        initChat();
      }, [tokenData, authUser, targetUserId]);

      if (loading || !chatClient || !channel) return <ChatLoader />;

      return <div className="h-[93vh]">
      <Chat client={chatClient}>
       <Channel channel={channel}>
        <div className="w-full relative">
            <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
            <Thread />  
            </Window>
        </div>
        </Channel>
      </Chat>
      </div>;
};
export default ChatPage;