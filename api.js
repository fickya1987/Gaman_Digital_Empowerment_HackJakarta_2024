const API_BASE_URL = "https://api.videosdk.live"; // Base URL for VideoSDK API

// Get the environment variables or set defaults
const VIDEOSDK_TOKEN = process.env.REACT_APP_VIDEOSDK_TOKEN;
const API_AUTH_URL = process.env.REACT_APP_AUTH_URL;

// Helper function to fetch the security token
export const getToken = async () => {
  if (!VIDEOSDK_TOKEN && !API_AUTH_URL) {
    console.error("Error: Please configure your authentication method.");
    return null;
  }
  if (VIDEOSDK_TOKEN) {
    return VIDEOSDK_TOKEN;
  }

  try {
    const response = await fetch(`${API_AUTH_URL}/get-token`, { method: "GET" });
    const json = await response.json();
    return json.token;
  } catch (error) {
    console.error("Failed to fetch token:", error);
    return null;
  }
};

// Common method to handle HTTP requests
const fetchFromAPI = async (url, options) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) {
      return { data: data, err: null };
    } else {
      return { data: null, err: data.error || "An unknown error occurred." };
    }
  } catch (error) {
    console.error("API request failed:", error);
    return { data: null, err: error.message };
  }
};

// Function to create a meeting with provided credentials
export const createMeeting = async (token) => {
  const url = `${API_BASE_URL}/v2/rooms`;
  const options = {
    method: "POST",
    headers: { Authorization: token, "Content-Type": "application/json" },
  };
  return await fetchFromAPI(url, options);
};

// Function to validate a meeting by ID
export const validateMeeting = async ({ roomId, token }) => {
  const url = `${API_BASE_URL}/v2/rooms/validate/${roomId}`;
  const options = {
    method: "GET",
    headers: { Authorization: token, "Content-Type": "application/json" },
  };
  return await fetchFromAPI(url, options);
};
