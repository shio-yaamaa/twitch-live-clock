export class PageLifecycleObserver {
  private interval: number;
  private previousUrl: string;
  private targetElement: HTMLElement | null;
  private listener: (() => void) | null;

  constructor(interval: number) {
    this.interval = interval;
    this.previousUrl = document.location.href;
    this.targetElement = null;
    this.listener = null;
  }

  public observe() {
    const observe = () => {
      const hasUrlChanged = this.checkUrlChange();
      const hasUnmounted = this.checkElementUnmounted();
      if (hasUrlChanged || hasUnmounted) {
        console.log('[Twitch Live Clock] Page change detected');
        this.listener && this.listener();
      }
      setTimeout(observe, this.interval);
    };
    observe();
  }

  private checkUrlChange(): boolean {
    const currentUrl = document.location.href;
    const hasChanged = currentUrl !== this.previousUrl;
    this.previousUrl = currentUrl;
    return hasChanged;
  }

  private checkElementUnmounted(): boolean {
    return (this.targetElement && !this.targetElement.isConnected) ?? false;
  }

  public setTargetElement(element: HTMLElement) {
    this.targetElement = element;
  }

  public setPageChangeEventListener(listener: () => void) {
    this.listener = listener;
  }
}
