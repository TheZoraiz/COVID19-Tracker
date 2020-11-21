import './charts.css';
import { Line } from 'react-chartjs-2'
import { useState, useEffect } from 'react'


function CustomChart({ title, graphData, type, text }) {
  const [ sample, setSample ] = useState({});
  const [ typeBool ] = useState((type == 'first'))

  useEffect(() => {
    setSample({
      labels: graphData.map(element => element.date.slice(0, 10)),
      datasets: [
        {
          label: typeBool ? 'Total Case History' : 'Active Cases',
          data: typeBool ? graphData.map(element => element.confirmed) : graphData.map(element => element.active),
          backgroundColor: 'rgba(1,1,1,0)',
          borderWidth: 2,
          borderColor: typeBool ? '#ff4040' : 'orange',
          radius: 1.2,
        },
        {
          label: typeBool? 'Total Cases Recovered' : 'Total Deaths',
          data: typeBool ? graphData.map(element => element.recovered) : graphData.map(element => element.deaths),
          backgroundColor: 'rgba(1,1,1,0)',
          borderWidth: 2,
          borderColor: typeBool ? 'turquoise' : 'red',
          radius: 1.2,
        },
      ]
    });
  }, [graphData])

  return (
    <div className="chart">
      <h2 className='country-title'>{typeBool ? `${title} Case History` : `${title} Current Cases`}</h2>
      <Line
      data={sample}
      height={null}
      width={null}
      options={{
        aspectRatio: 1.15,
        resposive: true,
      }}
      />
    </div>
  );
}

export default CustomChart;
