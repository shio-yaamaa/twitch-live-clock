import {
  calculateStreamedTime,
  DateTime,
  formatDateTime,
  parseWatchTime,
} from './datetime';
import { copyClasses } from './dom';

export class Clock {
  private startTime: DateTime;
  private clockElement: HTMLElement | null;
  private watchTimeElement: HTMLElement | null;
  private observer: MutationObserver | null;
  private readyListener: (() => void) | null;

  constructor(startTime: DateTime) {
    this.startTime = startTime;
    this.watchTimeElement = null;
    this.clockElement = null;
    this.observer = null;
    this.readyListener = null;
  }

  public async mountWhenReady() {
    await this.waitForPlayerReady();
    this.insertClock();
    this.observer = new MutationObserver(() => {
      this.updateClock();
    });
    if (this.watchTimeElement) {
      this.observer.observe(this.watchTimeElement, {
        subtree: true,
        characterData: true,
      });
    }
  }

  public unmount() {
    console.log('[Twitch Live Clock] Unmounted');
    this.clockElement?.remove();
    this.observer?.disconnect();
  }

  public setReadyListener(listener: () => void) {
    this.readyListener = listener;
  }

  public getWatchTimeElement(): HTMLElement | null {
    return this.watchTimeElement;
  }

  private async waitForPlayerReady(): Promise<void> {
    return new Promise((resolve) => {
      const checkPlayerReady = () => {
        this.watchTimeElement = document.querySelector(
          '[data-a-target="player-seekbar-current-time"]'
        );
        if (this.watchTimeElement) {
          console.log(
            '[Twitch Live Clock] watchTimeElement found:',
            this.watchTimeElement
          );
          this.readyListener && this.readyListener();
          resolve();
        } else {
          console.log('[Twitch Live Clock] watchTimeElement not found');
          window.setTimeout(checkPlayerReady, 500);
        }
      };
      checkPlayerReady();
    });
  }

  private insertClock() {
    // Create and initialize the clock element
    if (!this.watchTimeElement) {
      return;
    }
    this.clockElement = document.createElement('p');
    copyClasses(this.watchTimeElement, this.clockElement);
    this.updateClock();

    // Insert the clock element
    const parent = this.watchTimeElement.parentElement;
    const remainingTimeElement = this.watchTimeElement.nextElementSibling;
    if (!parent || !remainingTimeElement) {
      return;
    }
    // If another clock is already inserted, do nothing
    if (
      remainingTimeElement.getAttribute('data-a-target') !==
      'player-seekbar-duration'
    ) {
      return;
    }
    parent.insertBefore(this.clockElement, remainingTimeElement);
  }

  private updateClock() {
    if (!this.clockElement || !this.watchTimeElement) {
      return;
    }
    const watchTime = parseWatchTime(this.watchTimeElement.innerText);
    if (!watchTime) {
      return;
    }
    const streamedTime = calculateStreamedTime(this.startTime, watchTime);
    this.clockElement.textContent = formatDateTime(streamedTime);
  }
}
