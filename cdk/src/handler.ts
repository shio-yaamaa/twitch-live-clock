import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda';
import { getVideo } from './twitchApi';

export const handler: Handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const twitchClientId = process.env.TWITCH_CLIENT_ID;
  const twitchAppAccessToken = process.env.TWITCH_APP_ACCESS_TOKEN;
  if (!twitchClientId || !twitchAppAccessToken) {
    throw new Error('Invalid environment variables');
  }

  const videoId = event.queryStringParameters?.videoId;
  if (!videoId) {
    throw new Error('Invalid query parameters: videoId required');
  }

  const video = await getVideo(twitchClientId, twitchAppAccessToken, videoId);
  if (!video) {
    return {
      statusCode: 404,
      body: 'Not Found',
    };
  }

  return {
    statusCode: 200,
    body: video.published_at,
  };
};
