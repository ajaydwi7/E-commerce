import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const Card = ({ title, data, options }) => {
  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: data,
      options: options,
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [title, data, options]);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <canvas ref={canvasRef} id={title}></canvas>
    </div>
  );
};

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Sales',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      backgroundColor: 'rgba(75,192,192,0.4)',
      borderColor: 'rgba(75,192,192,1)',
    },
    {
      label: 'Users',
      data: [28, 48, 40, 19, 86, 27, 90],
      fill: false,
      backgroundColor: 'rgba(153,102,255,0.4)',
      borderColor: 'rgba(153,102,255,1)',
    },
    {
      label: 'Orders',
      data: [18, 48, 77, 9, 100, 27, 40],
      fill: false,
      backgroundColor: 'rgba(255,159,64,0.4)',
      borderColor: 'rgba(255,159,64,1)',
    },
  ],
};

const options = {
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const Cards = () => {
  return (
    <div className="flex justify-around mt-5">
      <Card title="Sales" data={data} options={options} />
      <Card title="Users" data={data} options={options} />
      <Card title="Orders" data={data} options={options} />
    </div>
  );
};

export default Cards;