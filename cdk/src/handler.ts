import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Handler,
} from 'aws-lambda';

export const handler: Handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const twitchBearerToken = process.env.TWITCH_BEARER_TOKEN;
  if (!twitchBearerToken) {
    throw new Error('Invalid environment variables');
  }

  console.log('token', twitchBearerToken);
  console.log('params log', event.queryStringParameters);

  return {
    statusCode: 200,
    body: 'ok!',
  };
};
