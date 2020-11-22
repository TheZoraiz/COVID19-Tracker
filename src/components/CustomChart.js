import './charts.css';
import { Line } from 'react-chartjs-2'
import { useState, useEffect } from 'react'


function CustomChart({ title, graphData, type, dots }) {
  const [ sample, setSample ] = useState({});
  const [ typeBool ] = useState((type == 'first'))

  useEffect(() => {
    setSample({
      labels: graphData.map(element => dots != 0 ? element.date.date : element.date.date.slice(3)),
      datasets: [
        {
          label: typeBool ? 'Total Cases To Date' : 'Active Cases',
          data: graphData.map(element => typeBool ? element.confirmed : element.active),
          backgroundColor: 'rgba(1,1,1,0)',
          borderWidth: 2,
          borderColor: typeBool ? '#ff4040' : 'orange',
          radius: dots,
        },
        {
          label: typeBool? 'Total Recoveries To Date' : 'Total Deaths',
          data: graphData.map(element => typeBool ? element.recovered : element.deaths),
          backgroundColor: 'rgba(1,1,1,0)',
          borderWidth: 2,
          borderColor: typeBool ? 'turquoise' : 'red',
          radius: dots,
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

export default CustomChart;
