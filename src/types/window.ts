export type ExtendedWindow = Window & {
  cancelIdleCallack: (handler: unknown) => void;
};
