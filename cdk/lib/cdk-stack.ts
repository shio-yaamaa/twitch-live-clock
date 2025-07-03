import { Duration, Stack, type StackProps } from "aws-cdk-lib";
import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import type { Construct } from "constructs";
import * as dotenv from "dotenv";
import type { StackConfig } from "../stack-config";

interface TwitchLiveClockStackProps extends StackProps {
  config: StackConfig;
}

dotenv.config();

export class TwitchLiveClockStack extends Stack {
  constructor(scope: Construct, id: string, props?: TwitchLiveClockStackProps) {
    super(scope, id, props);

    const config = props?.config;

    if (!config) {
      throw new Error("Invalid stack config");
    }

    const handler = new NodejsFunction(
      this,
      `TwitchLiveClockStartTimeHandler${config.resourceNameSuffix}`,
      {
        runtime: Runtime.NODEJS_22_X,
        entry: "lambda/src/handler.ts",
        handler: "handler",
        environment: {
          TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID ?? "",
          TWITCH_CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET ?? "",
          GOOGLE_APPLICATION_CREDENTIALS:
            "/var/task/bigquery-service-account-key.json",
          BIGQUERY_PROJECT_ID: process.env.BIGQUERY_PROJECT_ID ?? "",
          BIGQUERY_DATASET_ID: process.env.BIGQUERY_DATASET_ID ?? "",
          BIGQUERY_TABLE_ID: process.env.BIGQUERY_TABLE_ID ?? "",
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
      },
    );

    const api = new HttpApi(
      this,
      `TwitchLiveClockApi${config.resourceNameSuffix}`,
      {
        corsPreflight: {
          allowOrigins: ["*"],
          allowMethods: [CorsHttpMethod.ANY],
          allowHeaders: ["*"],
        },
      },
    );
    api.addRoutes({
      path: "/start-time",
      methods: [HttpMethod.GET],
      integration: new HttpLambdaIntegration(
        `TwitchLiveClockStartTimeIntegration${config.resourceNameSuffix}`,
        handler,
      ),
    });
  }
}
