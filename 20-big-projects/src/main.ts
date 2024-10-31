import App from './app/App';

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('canvas.myWebgl') as HTMLCanvasElement;
  
  const app = new App(canvas);
  app.init();
});
