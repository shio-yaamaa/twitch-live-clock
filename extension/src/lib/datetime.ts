import dayjs from "dayjs";

export type DateTime = dayjs.Dayjs;

interface Duration {
  hours: number;
  minutes: number;
  seconds: number;
}

export const parseISO8601 = (text: string): DateTime => {
  return dayjs(text);
};

export const parseWatchTime = (watchTime: string): Duration | null => {
  const split = watchTime.split(":").map((item) => parseInt(item));
  switch (split.length) {
    case 2:
      return {
        hours: 0,
        minutes: split[0],
        seconds: split[1],
      };
    case 3:
      return {
        hours: split[0],
        minutes: split[1],
        seconds: split[2],
      };
    default:
      return null;
  }
};

export const calculateStreamedTime = (
  startTime: DateTime,
  watchTime: Duration,
): DateTime => {
  return startTime
    .add(watchTime.hours, "hour")
    .add(watchTime.minutes, "minute")
    .add(watchTime.seconds, "second");
};

export const formatDateTime = (datetime: DateTime): string => {
  return datetime.format("YYYY/M/D H:mm:ss (Z)");
};
