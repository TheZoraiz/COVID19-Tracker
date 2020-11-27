import './charts.css';
import { Line } from 'react-chartjs-2'
import { useState, useEffect } from 'react'


function SingleLineChart({ title, type, graphData, dotRadius, label, color }) {
  const [ sample, setSample ] = useState({});

  useEffect(() => {
    setSample({
      labels: graphData.map(element => element.date.date),
      datasets: [
        {
            label: label,
            data: graphData.map(element => type == 'Active' ? element.active : element.deaths),
            backgroundColor: 'rgba(1,1,1,0)',
            borderWidth: 2,
            borderColor: color,
            radius: dotRadius,
        },
      ]
    });
  }, [graphData])

  return (
    <div className="chart">
      <h2 className='country-title'>{title}</h2>
      <Line
        data={sample}
        height={null}
        width={null}
        options={{
          aspectRatio: 1.15,
          resposive: true,
          legend: {
            labels: {
              fontSize: 15,
              fontColor: 'black'
            }
          }
        }}
      />
    </div>
  );
}

export default SingleLineChart;
