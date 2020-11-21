import './App.css';
import { useState, useEffect } from 'react'

import Loading from './components/Loading.js'
import CustomChart from './components/CustomChart.js'

const App = () => {
  const [ visible, setVisible ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ loadText, setLoadText ] = useState('Loading...');

  useEffect(() => {

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVisible(true);
    }, 1000)

  }, [])

  return (
    <div className="App">
      <h1 className='heading'>COVID-19 Tracker</h1>
      <h3 id='daddy'>By Zoraiz</h3>
      
      {visible && <CustomChart />}
      {loading && <Loading text={loadText} />}
    </div>
  );
}

export default App;
