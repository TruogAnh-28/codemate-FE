class ReloadManager {
  private listeners: Record<string, (() => Promise<void>)[]> = {};

  // Register a reload listener for a specific key
  on(key: string, callback: () => Promise<void>) {
    if (!this.listeners[key]) {
      this.listeners[key] = [];
    }
    this.listeners[key].push(callback);
  }

  // Trigger reload for a specific key
  async trigger(key: string) {
    const keyListeners = this.listeners[key];
    if (keyListeners) {
      await Promise.all(keyListeners.map(listener => listener()));
    }
  }

  // Remove a specific listener
  off(key: string, callback?: () => Promise<void>) {
    if (!callback) {
      delete this.listeners[key];
      return;
    }
    this.listeners[key] = this.listeners[key].filter(
      listener => listener !== callback
    );
  }
}

export const reloadManager = new ReloadManager();
