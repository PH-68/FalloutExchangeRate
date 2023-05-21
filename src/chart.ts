import { Chart, Colors, BarController, BarElement, LineController, LineElement, PointElement, LinearScale, TimeScale, Tooltip } from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';
import { getTransactionArray } from './transaction-log';

Chart.register(zoomPlugin, Colors, BarController, BarElement, LineController, LineElement, PointElement, LinearScale, TimeScale, Tooltip);
Chart.defaults.color = '#a7acb1';

export let priceChart: Chart<"line" | "bar", Number[], string>;

export async function setupCanvas(canvas: HTMLCanvasElement, isInit: boolean) {
    var response = await fetch("https://raw.githubusercontent.com/PH-68/FalloutExchangeRate/data/rate.csv?c=" + new Date().getTime(), { method: "GET" });
    let sellPrice: Number[] = [];
    let buyPrice: Number[] = [];
    let avgPrice: Number[] = [];
    let dateTime: string[] = [];
    let transactionArray = await getTransactionArray(new Date("2023-05-15 16:30:39"), 0);
    let transactionSum: number[] = [];
    const content: string = await response.text();
    content.split("\n").forEach(element => {
        if (element != "") {
            sellPrice.push(Number(element.split(",")[1].split("/")[0]));
            buyPrice.push(Number(element.split(",")[1].split("/")[1]));
            avgPrice.push((Number(element.split(",")[1].split("/")[1]) + Number(element.split(",")[1].split("/")[0])) / 2)
            dateTime.push(element.split(",")[0])
            let sum = 0
            for (let index = 0; index < transactionArray.map(x => x[1]).findIndex(x => new Date(x) > new Date(element.split(",")[0])); index++) {
                sum += Number(transactionArray[0][0]);
                transactionArray = transactionArray.slice(1);
            }
            transactionSum.push(sum);
        };
    });
    document.querySelector<HTMLElement>('#titleCurrentPrice')!.innerHTML = avgPrice[avgPrice.length - 1].toLocaleString("en-US");
    document.querySelector<HTMLElement>('#titleCurrentDate')!.innerHTML = `${dateTime[dateTime.length - 1]} (${((new Date().getTime() - new Date(dateTime[dateTime.length - 1]).getTime()) / 1000 / 60).toFixed(0)} min ago)`;
    if (isInit) {
        priceChart = new Chart(canvas, {
            data: {
                labels: dateTime,
                datasets: [{
                    type: 'line',
                    label: 'Buy Price',
                    data: buyPrice,
                    fill: false,
                    tension: 0.1,
                    yAxisID: 'yLine',
                    pointRadius: 0
                }, {
                    type: 'line',
                    label: 'Sell Price',
                    data: sellPrice,
                    fill: false,
                    tension: 0.1,
                    yAxisID: 'yLine',
                    pointRadius: 0
                },
                {
                    type: 'line',
                    label: 'Avg Price',
                    data: avgPrice,
                    fill: false,
                    tension: 0.1,
                    yAxisID: 'yLine',
                    pointRadius: 0
                }, {
                    type: 'bar',
                    label: '村民錠Diff',
                    data: transactionSum,
                    barThickness: 4,
                    yAxisID: 'yBar',
                    borderRadius: 2,
                    borderWidth: 2,
                }]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    decimation: { enabled: true },
                    zoom: {
                        pan: {
                            enabled: true,
                            mode: 'x'
                        },
                        zoom: {
                            wheel: {
                                enabled: true,
                            },
                            pinch: {
                                enabled: true
                            },
                            mode: 'x',
                        },
                        limits: {
                            x: { min: 'original', max: "original" }
                        }
                    }
                },
                scales: {
                    x: {
                        suggestedMax: "",
                        type: 'time',
                        offset: false,
                        time: {
                            displayFormats: {
                                quarter: 'MMM YYYY'
                            }
                        }
                    },
                    yBar: {
                        position: 'right',
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '村民錠'
                        },
                    },
                    yLine: {
                        position: 'left',
                        beginAtZero: false,
                        title: {
                            display: true,
                            text: 'Emerald'
                        }
                    }
                }
            }
        });
    }
    else {
        priceChart.data.labels = dateTime;
        priceChart.data.datasets[0].data = buyPrice;
        priceChart.data.datasets[1].data = sellPrice;
        priceChart.data.datasets[2].data = avgPrice;
        priceChart.data.datasets[3].data = transactionSum;
        priceChart.update();
    }
}