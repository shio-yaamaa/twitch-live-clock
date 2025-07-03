import {
  calculateStreamedTime,
  type DateTime,
  formatDateTime,
  parseWatchTime,
} from "./datetime";
import { copyClasses } from "./dom";

export class Clock {
  private startTime: DateTime;
  private clockElements: HTMLElement[];
  private watchTimeElements: HTMLElement[];
  private observer: MutationObserver | null;

  constructor(startTime: DateTime) {
    this.startTime = startTime;
    this.clockElements = [];
    this.watchTimeElements = [];
    this.observer = null;
  }

  public async mountWhenReady() {
    await this.waitForPlayerReady();
    this.insertClock();
    this.observer = new MutationObserver(() => {
      this.updateClock();
    });
    if (this.watchTimeElements.length > 0) {
      this.observer.observe(this.watchTimeElements[0], {
        subtree: true,
        characterData: true,
      });
    }
  }

  public unmount() {
    console.log("[Twitch Live Clock] Unmounted");
    for (const clockElement of this.clockElements) {
      clockElement.remove();
    }
    this.observer?.disconnect();
  }

  private async waitForPlayerReady(): Promise<void> {
    return new Promise((resolve) => {
      const checkPlayerReady = () => {
        this.watchTimeElements = Array.from(
          document.querySelectorAll(
            '[data-a-target="player-seekbar-current-time"]',
          ),
        );
        if (this.watchTimeElements.length > 0) {
          console.log(
            "[Twitch Live Clock] watchTimeElements found:",
            this.watchTimeElements,
          );
          resolve();
        } else {
          console.log("[Twitch Live Clock] watchTimeElements not found");
          window.setTimeout(checkPlayerReady, 500);
        }
      };
      checkPlayerReady();
    });
  }

  private insertClock() {
    for (const watchTimeElement of this.watchTimeElements) {
      // Create and initialize the clock element
      const clockElement = document.createElement("p");
      this.clockElements.push(clockElement);
      copyClasses(watchTimeElement, clockElement);

      // Insert the clock element
      const parent = watchTimeElement.parentElement;
      const remainingTimeElement = watchTimeElement.nextElementSibling;
      if (!parent || !remainingTimeElement) {
        continue;
      }
      // If another clock is already inserted, do nothing
      if (
        remainingTimeElement.getAttribute("data-a-target") !==
        "player-seekbar-duration"
      ) {
        continue;
      }
      parent.insertBefore(clockElement, remainingTimeElement);
    }
    this.updateClock();
  }

  private updateClock() {
    if (this.watchTimeElements.length === 0) {
      return;
    }
    const watchTime = parseWatchTime(this.watchTimeElements[0].innerText);
    if (!watchTime) {
      return;
    }
    const streamedTime = calculateStreamedTime(this.startTime, watchTime);
    for (const clockElement of this.clockElements) {
      clockElement.textContent = formatDateTime(streamedTime);
    }
  }
}
