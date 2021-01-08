import './charts.css';
import { Line } from 'react-chartjs-2'
import { useState, useEffect } from 'react'


const DoubleLineChart = ({
  country,
  title,
  firstLabel,
  secondLabel,
  graphData,
  dotRadius,
  }) => {
  const [ sample, setSample ] = useState({});

  useEffect(() => {
    setSample({
      labels: graphData.map(element => element.newDate.date),
      datasets: [
        {
          label: firstLabel,
          // label: typeBool ? 'Total Cases To Date' : 'Active Cases',
          data: graphData.map(element => element.confirmed),
          backgroundColor: 'rgba(1,1,1,0)',
          borderWidth: 2,
          borderColor: 'red',
          radius: dotRadius,
        },
        {
          label: secondLabel,
          // label: typeBool ? 'Total Recoveries To Date' : 'Total Deaths',
          data: graphData.map(element => element.recovered),
          backgroundColor: 'rgba(1,1,1,0)',
          borderWidth: 2,
          borderColor: 'turquoise',
          radius: dotRadius,
        },
      ]
    });
  }, [graphData])

  return (
    <div className="chart">
      <h2 className='country-name'>{country}</h2>
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

export default DoubleLineChart;
