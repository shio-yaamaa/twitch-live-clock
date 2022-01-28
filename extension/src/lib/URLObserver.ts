export class URLObserver {
  private interval: number;
  private previousURL: string;
  private listener: (() => void) | null;

  constructor(interval: number) {
    this.interval = interval;
    this.previousURL = document.location.href;
    this.listener = null;
  }

  public observe() {
    const observe = () => {
      if (this.checkURLChange()) {
        console.log('[Twitch Live Clock] URL change detected');
        this.listener && this.listener();
      }
      setTimeout(observe, this.interval);
    };
    observe();
  }

  private checkURLChange(): boolean {
    const currentUrl = document.location.href;
    const hasChanged = currentUrl !== this.previousURL;
    this.previousURL = currentUrl;
    return hasChanged;
  }

  public setURLChangeListener(listener: () => void) {
    this.listener = listener;
  }
}
