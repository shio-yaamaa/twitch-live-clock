import { type DateTime, parseISO8601 } from "./datetime";

const START_TIME_ENDPOINT =
  "https://usa6k2nlql.execute-api.us-east-1.amazonaws.com/start-time";

export const getStartTime = async (
  videoId: string,
): Promise<DateTime | null> => {
  const url = new URL(START_TIME_ENDPOINT);
  url.searchParams.append("videoId", videoId);
  const response = await fetch(url.toString());
  if (response.ok) {
    const data = await response.text();
    return data ? parseISO8601(data) : null;
  } else {
    return null;
  }
};
