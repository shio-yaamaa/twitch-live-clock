# Commands

```sh
# Prod
npx cdk diff TwitchLiveClockStack
npx cdk deploy TwitchLiveClockStack

# Dev
npx cdk diff TwitchLiveClockStackDev
npx cdk deploy TwitchLiveClockStackDev
```

# Invoking API

## Prod

```sh
% curl "https://usa6k2nlql.execute-api.us-east-1.amazonaws.com/start-time?videoId=0000000000"
0000-00-00T00:00:00Z
```

## Dev

```sh
% curl "https://1mp2pfwmxi.execute-api.us-east-1.amazonaws.com/start-time?videoId=0000000000"
0000-00-00T00:00:00Z
```
