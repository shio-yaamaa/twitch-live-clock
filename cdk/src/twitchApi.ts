import axios, { AxiosResponse } from 'axios';
import { URL } from 'url';

import { TwitchVideo } from './types';

export const getVideo = async (
  clientId: string,
  appAccessToken: string,
  videoId: string
): Promise<TwitchVideo | null> => {
  const url = new URL('https://api.twitch.tv/helix/videos');
  url.searchParams.append('id', videoId);

  let response: AxiosResponse<any, any>;
  try {
    response = await axios.get(url.toString(), {
      headers: {
        'Client-Id': clientId,
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
      console.log('Error', error.message);
    }
    console.log(error.config);
    throw new Error('Request failed');
  }

  const data = response.data;

  if (!data.data || data.data.length === 0) {
    return null;
  }

  return data.data[0];
};
