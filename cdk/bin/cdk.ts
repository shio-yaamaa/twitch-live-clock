#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { TwitchLiveClockStack }from '../lib/cdk-stack';
import { configs, environments } from '../stack-config';

const app = new cdk.App();

for (const environment of environments) {
  const config = configs[environment]
  new TwitchLiveClockStack(app, `TwitchLiveClockStack${config.resourceNameSuffix}`, {
    env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-east-1' },
    config,
  });
}
