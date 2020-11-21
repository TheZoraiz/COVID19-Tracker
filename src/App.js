import './App.css';
import { useState, useEffect } from 'react'
import Select from 'react-select';

import CustomChart from './components/CustomChart.js'
import Loading from './components/Loading.js'
const fetch = require('node-fetch');

const fetchCountries = () => {
  return new Promise((resolve, reject) => {
    fetch('https://api.covid19api.com/summary')
      .then(res => res.json())
      .then(json => {
        json = json.Countries;
        // Array of objects with country names and slugs
        let totalCountries = json.map(element => {
          return {name: element.Country, slug: element.Slug}
        });
        resolve([...totalCountries]);
      })
      .catch(error => {
        reject(error);
      });
  }); 
}

const fetchCountryRecentMonthData = (country) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.covid19api.com/country/${country}`)
      .then(res => res.json())
      .then(json => {
        // Get the most recent month's data
        let recentMonthData = json.slice(json.length - 30, json.length);

        resolve([...recentMonthData]);
      })
      .catch(error => {
        reject(error);
      });
  }); 
}

const App = () => {
  const [ visible, setVisible ] = useState(false);
  const [ temp, setTemp ] = useState([]);
  const [ countries, setCountries ] = useState([]);
  const [ selectedCountry, setSelectedCountry ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  let key = 1;


  const getCountryData = async(country) => {
    let data = await fetchCountryRecentMonthData(country.value);
    let dataCases = data.map(element => {
      return {
        name: element.Country,
        confirmed: element.Confirmed,
        recovered: element.Recovered,
        active: element.Active,
        deaths: element.Deaths,
        date: element.Date
      }
    });

    setTemp(dataCases);
    setSelectedCountry(country.value);
    setVisible(true);
    setLoading(false);
  }

  useEffect(async() => {
    let totalCountries = await fetchCountries()
    setCountries(totalCountries);
    getCountryData({value: totalCountries[0].slug})
  }, [])


  return (
    <div className="App">
      <h1 className='heading'>Monthly COVID-19 Tracker</h1>
      <h3 id='daddy'>By Zoraiz</h3>
      
      <div className='select-container'>
        <h3>Select Country</h3>
        <Select
          options={ countries.map(country => {
            return {value: country.slug, label: country.name}
          }) }
          value={ 'afghanistan' }
          onChange={ getCountryData }
        />
      </div>

      {visible && 
        <div className='row'>
        <CustomChart title={temp[0].name} type={'first'} graphData={temp} />
        <CustomChart title={temp[0].name} type={'second'} graphData={temp} /> 
        </div>
      }
      {loading && <Loading className='charts' text={'Loading...'} />}
    </div>
  );
}

export default App;
