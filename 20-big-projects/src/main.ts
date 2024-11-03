import App from './app/App';
import Helper from './gui/Helper';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('canvas.myWebgl') as HTMLCanvasElement;

  if (!canvas) {
    throw new Error('Canvas not found');
  }

  new Helper();
  new App(canvas);
});
