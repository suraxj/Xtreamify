import { StreamChat } from "stream-chat";
import "dotenv/config";

const apiKey = process.env.XTEAM_API_KEY;
const apiSecret = process.env.XTEAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("Xtream API key or Secret is missing");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.error("Error upserting Xtream user:", error);
  }
};

export const generateStreamToken = (userId) => {
    try {
      // Ensure userId is a String
      const userIdStr = String(userId);
      return streamClient.createToken(userIdStr);  
    } catch (error) {
        console.log("Error generating Stream token", error);
        
    }
};