
import React, { useEffect, useRef } from 'react';
import { metersToMiles } from '../utils/helpers';

// Declare Chart in the global scope for TypeScript
declare const Chart: any;

interface ElevationChartProps {
    altitudes: (number | null)[];
    distance: number; // total distance in meters
}

const ElevationChart: React.FC<ElevationChartProps> = ({ altitudes, distance }) => {
    const chartContainerRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstanceRef = useRef<any | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const validAltitudes = altitudes.filter(alt => alt !== null) as number[];
        if (validAltitudes.length < 2) return;

        const totalDistanceMiles = metersToMiles(distance);
        const labels = validAltitudes.map((_, index) => {
            const progress = index / (validAltitudes.length - 1);
            return (progress * totalDistanceMiles).toFixed(2);
        });

        const ctx = chartContainerRef.current.getContext('2d');
        if (!ctx) return;
        
        // Destroy previous chart instance if it exists
        if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy();
        }

        const gradient = ctx.createLinearGradient(0, 0, 0, chartContainerRef.current.clientHeight);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');


        chartInstanceRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Elevation (ft)',
                    data: validAltitudes.map(alt => alt * 3.28084), // convert meters to feet
                    borderColor: 'rgb(59, 130, 246)',
                    backgroundColor: gradient,
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.3,
                    fill: true,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            font: { size: 10 },
                            callback: function(value: number) {
                                return value + ' ft';
                            }
                        },
                         grid: {
                            drawBorder: false,
                        }
                    },
                    x: {
                        ticks: {
                           font: { size: 10 },
                            maxTicksLimit: 6,
                             callback: function(value: string) {
                                // @ts-ignore
                                return this.getLabelForValue(value) + ' mi';
                            }
                        },
                        grid: {
                            display: false,
                        }
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        enabled: true,
                         mode: 'index',
                        intersect: false,
                    }
                }
            }
        });

    }, [altitudes, distance]);

    return <canvas ref={chartContainerRef}></canvas>;
};

export default ElevationChart;
