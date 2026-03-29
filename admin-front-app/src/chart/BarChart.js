import React from "react";
// import { Chart as ChartJS, CategoryScale, } from 'chart.js';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

function BarChart({ chartData }) {
    // const canvasRef = useRef();
    return <Bar className="barChart"
        style = {
            {
                width: "100%",
                height: "100%"
            }
        }
        data={chartData}
    />
}

export default BarChart;