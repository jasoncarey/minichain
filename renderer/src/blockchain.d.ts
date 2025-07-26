declare global {
  interface Window {
    blockchain: {
      onStatusUpdate: (callback: (status: { status: string; message: string }) => void) => void;
      removeStatusListener: () => void;
    };
  }
}

export {};
