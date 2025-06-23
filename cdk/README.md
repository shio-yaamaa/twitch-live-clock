# Commands

- `yarn cdk deploy`
- `yarn cdk diff`
- `yarn cdk synth`

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
