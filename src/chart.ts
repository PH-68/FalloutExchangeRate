import Chart from 'chart.js/auto'
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';

Chart.register(zoomPlugin);
Chart.defaults.color = '#a7acb1';

export let priceChart: Chart<"line", Number[], string>;

export async function setupCanvas(canvas: HTMLCanvasElement, isInit: boolean) {
    var response = await fetch("https://raw.githubusercontent.com/PH-68/FalloutExchangeRate/data/rate.csv", { method: "GET" });
    let sellPrice: Number[] = [];
    let buyPrice: Number[] = [];
    let avgPrice: Number[] = [];
    let dateTime: string[] = [];
    let content: string = await response.text();
    content.split("\n").forEach(element => {
        if (element != "") {
            sellPrice.push(Number(element.split(",")[1].split("/")[0]));
            buyPrice.push(Number(element.split(",")[1].split("/")[1]));
            avgPrice.push((Number(element.split(",")[1].split("/")[1]) + Number(element.split(",")[1].split("/")[0])) / 2)
            dateTime.push(element.split(",")[0])
        };
    });
    document.querySelector<HTMLElement>('#titleCurrentPrice')!.innerHTML = String(avgPrice[avgPrice.length - 1]);
    console.log(dateTime);
    if (isInit) {
        priceChart = new Chart(canvas, {
            type: 'line',
            data: {
                labels: dateTime,
                datasets: [{
                    label: 'Buy Price',
                    data: buyPrice,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }, {
                    label: 'Sell Price',
                    data: sellPrice,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                },
                {
                    label: 'Avg Price',
                    data: avgPrice,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            },
            options: {
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
                        time: {
                            displayFormats: {
                                quarter: 'MMM YYYY'
                            }
                        }
                    }
                }
            }
        });
    }
    else {
        //Chart.defaults.scales.linear.min= document.querySelector<HTMLInputElement>('#datePicker1')?.textContent!
        //priceChart.options.scales!.x!.min = document.querySelector<HTMLInputElement>('#minDatePicker')?.value;
        //priceChart.options.scales!.x!.max = document.querySelector<HTMLInputElement>('#maxDatePicker')?.value;
        priceChart.data.labels = dateTime;
        priceChart.data.datasets[0].data = buyPrice;
        priceChart.data.datasets[1].data = sellPrice;
        priceChart.data.datasets[2].data = avgPrice;
        priceChart.update();
    }
}