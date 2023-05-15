import './scss/styles.scss'
import { setupCanvas, priceChart } from './chart.ts'
setIntervalImmediately(setupCanvas, document.querySelector<HTMLCanvasElement>('#myChart')!, 30000);

const theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
document.documentElement.setAttribute('data-bs-theme', theme);

document.getElementById("btnUpdateChart")?.addEventListener("click", () => setupCanvas(document.querySelector<HTMLCanvasElement>('#myChart')!, false))

document.getElementById("btnResetZoom")?.addEventListener("click", () => priceChart.resetZoom())

function setIntervalImmediately(func: Function, args: object, interval: number) {
  func(args, true);
  return setInterval(func, interval, args, false);
}