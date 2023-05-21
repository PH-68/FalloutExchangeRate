import { Chart, Colors, BarController, BarElement, LineController, LineElement, PointElement, LinearScale } from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';
Chart.register(zoomPlugin, Colors, BarController, BarElement, LineController, LineElement, PointElement, LinearScale);
Chart.defaults.color = '#a7acb1';

export let priceChart: Chart<"bar", Number[], string>;

export async function setupTransactionCanvas(canvas: HTMLCanvasElement, isInit: boolean) {
    const transactionArray = await getTransactionArray(new Date("2023-05-15 16:30:39"), 10)
    console.log(transactionArray.map(x => x[0]))
    if (isInit) {
        priceChart = new Chart(canvas, {
            type: 'bar',
            data: {
                labels: transactionArray.map(x => x[1]),
                datasets: [{
                    label: 'Buy Price',
                    data: transactionArray.map(x => x[0]),
                    borderWidth: 1
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
                        // type: 'time',
                        // border: {
                        //     width: 10
                        // },
                        // time: {
                        //     displayFormats: {
                        //         quarter: 'MMM YYYY'
                        //     }
                        // }
                    }
                }
            }
        });
    }
    else {
        priceChart.update();
    }
}

export async function getTransactionArray(filterDate: Date, filterNumber: number) {
    var response = await fetch("https://fallout-cors.poyi.workers.dev/?c=" + new Date().getTime(), { method: "GET" });
    const content: string = await response.text();
    let transactionLog: [number, string][] = [];
    //let transactionTime: string[] = [];
    content.split("\n").forEach(element => {
        if ((element != "") && (new Date(element.split(",")[3] + " GMT+08:00").getTime() > filterDate.getTime()) && Math.abs(Number(element.split(",")[1])) > filterNumber) {
            transactionLog.push([Number(element.split(",")[1]), element.split(",")[3]])
            //transactionTime.push()
        };
    });
    return transactionLog;
}