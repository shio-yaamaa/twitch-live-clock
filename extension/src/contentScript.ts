import { Clock } from './lib/Clock';
import { PageLifecycleObserver } from './lib/PageLifecycleObserver';
import { getStartTime } from './lib/twitchApi';
import { getVideoIdFromUrl } from './lib/url';

const observer = new PageLifecycleObserver(500);
observer.observe();

const main = async () => {
  const videoId = getVideoIdFromUrl(new URL(window.location.href));
  console.log('[Twitch Live Clock] Video ID:', videoId);
  if (!videoId) {
    return;
  }
  const startTime = await getStartTime(videoId);
  if (!startTime) {
    return;
  }

  const clock = new Clock(startTime);

  clock.setReadyListener(() => {
    const lifecycleReferenceElement = clock.getWatchTimeElement();
    lifecycleReferenceElement &&
      observer.setTargetElement(lifecycleReferenceElement);
  });
  observer.setPageChangeEventListener(() => {
    clock.unmount();
    main();
  });

  await clock.mountWhenReady();
};

main();
