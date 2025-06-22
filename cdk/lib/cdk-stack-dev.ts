import * as dotenv from 'dotenv';
import { Construct } from 'constructs';
import { Stack, StackProps, Duration } from 'aws-cdk-lib';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { HttpApi, HttpMethod, CorsHttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';

dotenv.config();

export class TwitchLiveClockStackDev extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const handler = new NodejsFunction(this, 'TwitchLiveClockStartTimeHandlerDev', {
      runtime: Runtime.NODEJS_22_X,
      entry: 'lambda/src/handler.ts',
      handler: 'handler',
      environment: {
        TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID ?? '',
        TWITCH_CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET ?? '',
        GOOGLE_APPLICATION_CREDENTIALS: '/var/task/bigquery-service-account-key.json',
        BIGQUERY_PROJECT_ID: process.env.BIGQUERY_PROJECT_ID ?? '',
        BIGQUERY_DATASET_ID: process.env.BIGQUERY_DATASET_ID ?? '',
        BIGQUERY_TABLE_ID: process.env.BIGQUERY_TABLE_ID ?? '',
      },
      bundling: {
        commandHooks: {
          beforeBundling(inputDir: string, outputDir: string): string[] {
            return [];
          },
          afterBundling(inputDir: string, outputDir: string): string[] {
            return [
              `cp ${inputDir}/lambda/bigquery-service-account-key.json ${outputDir}/bigquery-service-account-key.json`,
            ];
          },
          beforeInstall() {
            return [];
          },
        },
      },
      timeout: Duration.seconds(30),
    });

    const api = new HttpApi(this, 'TwitchLiveClockApiDev', {
      corsPreflight: {
        allowOrigins: ['*'],
        allowMethods: [CorsHttpMethod.ANY],
        allowHeaders: ['*'],
      },
    });
    api.addRoutes({
      path: '/start-time',
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration(
        'TwitchLiveClockStartTimeIntegrationDev',
        handler
      ),
    });
  }
}
