const VIDEO_ID_PATTERN = /^\/videos\/([0-9]+)$/;

export const getVideoIdFromUrl = (url: URL): string | null => {
  const matches = url.pathname.match(VIDEO_ID_PATTERN);
  if (!matches) {
    return null;
  }
  return matches[1] ?? null;
};
