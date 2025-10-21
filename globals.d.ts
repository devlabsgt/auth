// RUTA: ./globals.d.ts (DEBE EXISTIR EN LA RAÍZ)

declare interface Window {
  Image: typeof HTMLImageElement;
}

declare const Image: {
  new (): HTMLImageElement;
  prototype: HTMLImageElement;
};