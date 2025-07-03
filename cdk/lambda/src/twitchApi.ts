import axios, { type AxiosResponse } from "axios";
import { URL } from "url";

import type { TwitchVideo } from "./types";

export const getAppAccessToken = async (
  clientId: string,
  clientSecret: string,
): Promise<string | null> => {
  const url = new URL("https://id.twitch.tv/oauth2/token");
  url.searchParams.append("client_id", clientId);
  url.searchParams.append("client_secret", clientSecret);
  url.searchParams.append("grant_type", "client_credentials");
  url.searchParams.append("scope", "");

  let response: AxiosResponse<any, any>;
  try {
    response = await axios.post(url.toString());
  } catch (error: any) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
    console.log(error.config);
    throw new Error("Request failed");
  }

  return response.data.access_token;
};

export const getVideo = async (
  clientId: string,
  appAccessToken: string,
  videoId: string,
): Promise<TwitchVideo | null> => {
  const url = new URL("https://api.twitch.tv/helix/videos");
  url.searchParams.append("id", videoId);

  let response: AxiosResponse<any, any>;
  try {
    response = await axios.get(url.toString(), {
      headers: {
        "Client-Id": clientId,
        Authorization: `Bearer ${appAccessToken}`,
      },
    });
  } catch (error: any) {
    if (error.response.status === 404) {
      return null;
    }

    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
    console.log(error.config);
    throw new Error("Request failed");
  }

  const data = response.data;

  if (!data.data || data.data.length === 0) {
    return null;
  }

  return data.data[0];
};
