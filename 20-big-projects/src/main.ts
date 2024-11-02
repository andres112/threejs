import App from './app/App';
import Helper from './gui/Helper';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('canvas.myWebgl') as HTMLCanvasElement;

  if (!canvas) {
    throw new Error('Canvas not found');
  }

  const gui  = new Helper();
  const app = new App(canvas);
});
