import * as dotenv from 'dotenv';
import { Construct } from 'constructs';
import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from '@aws-cdk/aws-apigatewayv2-alpha'; // aws-cdk-lib/aws-apigatewayv2 is not available yet
import { HttpLambdaIntegration } from '@aws-cdk/aws-apigatewayv2-integrations-alpha';

dotenv.config();

export class TwitchLiveClockStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const handler = new NodejsFunction(
      this,
      'TwitchLiveClockStartTimeHandler',
      {
        entry: 'src/handler.ts',
        runtime: Runtime.NODEJS_14_X,
        // code: lambda.Code.fromAsset(
        //   path.resolve(__dirname, './lambda/start-time-handler')
        // ),
        environment: {
          TWITCH_BEARER_TOKEN: process.env.TWITCH_BEARER_TOKEN ?? '',
        },
        timeout: Duration.seconds(30),
      }
    );

    const api = new apigateway.HttpApi(this, 'TwitchLiveClockApi', {
      // corsPreflight: {
      //   allowOrigins: ['*'],
      //   allowMethods: [apigateway.CorsHttpMethod.ANY],
      //   allowHeaders: ['*'],
      // },
    });
    api.addRoutes({
      path: '/start-time',
      methods: [apigateway.HttpMethod.GET],
      integration: new HttpLambdaIntegration(
        'TwitchLiveClockStartTimeIntegration',
        handler
      ),
    });
  }
}
