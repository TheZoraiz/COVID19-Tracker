// import './Loading.css';
import { Line } from 'react-chartjs-2'
import { useState, useEffect } from 'react'

function CustomChart({ text }) {
  const [ sample, setSample ] = useState({});

  useEffect(() => {
    setSample({
      labels: [ '1', '2', '3', '4', '5', '6', '7', '8' ],
      datasets: [
        {
          label: 'Haha sample go brrr',
          data: [ 6, 4, 8, 3, 2, 4, 6, 7 ],
          backgroundColor: 'rgba(1,1,1,0)',
          borderWidth: 2,
          borderColor: 'red',
        },
        {
          label: 'You no go brrr',
          data: [ 1, 1, 3, 8, 5, 0, 1, 5 ],
          backgroundColor: 'rgba(1,1,1,0)',
          borderWidth: 2,
          borderColor: 'turquoise',
        },
      ]
    });
  }, [])

  return (
    <div className="chart">
        <Line
          data={sample}
          options={{
            resposive: true,
          }}
        />
    </div>
  );
}

export default CustomChart;
