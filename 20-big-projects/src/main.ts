import App from './app/App';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('canvas.myWebgl') as HTMLCanvasElement;

  if (!canvas) {
    throw new Error('Canvas not found');
  }

  const app = new App(canvas);
});
