import { Clock } from "./lib/Clock";
import { getStartTime } from "./lib/twitchApi";
import { URLObserver } from "./lib/URLObserver";
import { getVideoIdFromUrl } from "./lib/url";

const observer = new URLObserver(500);
observer.observe();

const main = async () => {
  const clock = await createClock();
  observer.setURLChangeListener(() => {
    clock?.unmount();
    main();
  });
  await clock?.mountWhenReady();
};

const createClock = async (): Promise<Clock | null> => {
  const videoId = getVideoIdFromUrl(new URL(window.location.href));
  console.log("[Twitch Live Clock] Video ID:", videoId);
  if (!videoId) {
    return null;
  }
  const startTime = await getStartTime(videoId);
  if (!startTime) {
    return null;
  }
  return new Clock(startTime);
};

main();
