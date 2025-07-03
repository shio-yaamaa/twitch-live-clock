# Overview

This project is a Chrome extension that works on Twitch video archive pages. While video archives only display the playback time of the video, this extension shows the actual time when the stream was live, displayed next to the playback time.

# How It Works

- When accessing a video archive page, the extension extracts the video ID from the URL.
- Using this video ID, it queries the Twitch API to get the start time of the stream.
- The extension then adds the current playback time to the stream's start time and displays this as the actual time when that moment was streamed live.

# Directory Structure

```
├── extension/       # Chrome extension code
│   ├── src/         # Source code for the extension
│   └── dist/        # Output directory for compiled code
└── cdk/             # Backend CDK
    └── lambda/      # Lambda function implementation for Twitch API queries
```
