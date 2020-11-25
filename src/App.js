import './App.css';
import { useState, useEffect } from 'react'
import Select from 'react-select';
import ReactGA from 'react-ga';

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
        let totalCountries = json.map(element => ({name: element.Country, slug: element.Slug}) );
        resolve([...totalCountries]);
      })
      .catch(error => {
        reject(error);
      });
  }); 
}

const fetchCountryData = (country) => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.covid19api.com/country/${country}`)
      .then(res => res.json())
      .then(json => {
        resolve([...json]);
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
  const [ loading, setLoading ] = useState(true);
  const [ chosenMonth, setChosenMonth ] = useState('');
  const [ chosenYear, setChosenYear ] = useState('2020');
  const [ yearlyDisplay, setYearlyDisplay ] = useState(false);
  
  const [ availableYears, setAvailableYears ] = useState([]);

  const alterDateFormat = (dates) => {
    let formatted = [];
    let totalYears = [];

    dates.forEach(date => {
      let day = date.slice(8, date.length);
      let month = date.slice(5, 7);
      let year = date.slice(0, 4);

      if(totalYears[totalYears.length - 1] != year)
        totalYears.push(year);

      switch(month) {
        case '01':
          formatted.push({month: 'January', year: year, date: `${day} Jan ${year}`});
          break;
        case '02':
          formatted.push({month: 'February', year: year, date: `${day} Feb ${year}`});
          break;
        case '03':
          formatted.push({month: 'March', year: year, date: `${day} March ${year}`});
          break;
        case '04':
          formatted.push({month: 'April', year: year, date: `${day} April ${year}`});
          break;
        case '05':
          formatted.push({month: 'May', year: year, date: `${day} May ${year}`});
          break;
        case '06':
          formatted.push({month: 'June', year: year, date: `${day} June ${year}`});
          break;
        case '07':
          formatted.push({month: 'July', year: year, date: `${day} July ${year}`});
          break;
        case '08':
          formatted.push({month: 'August', year: year, date: `${day} Aug ${year}`});
          break;
        case '09':
          formatted.push({month: 'September', year: year, date: `${day} Sept ${year}`});
          break;
        case '10':
          formatted.push({month: 'October', year: year, date: `${day} Oct ${year}`});
          break;
        case '11':
          formatted.push({month: 'November', year: year, date: `${day} Nov ${year}`});
          break;
        case '12':
          formatted.push({month: 'December', year: year, date: `${day} Dec ${year}`});
          break;
      }
    });

    setChosenMonth(formatted[formatted.length - 1].month);
    setAvailableYears(totalYears);
    return formatted;
  }

  const getCountryData = async(country) => {
    let data = await fetchCountryData(country.value);
    let dataCases = data.map(element => {
      return {
        name: element.Country,
        confirmed: element.Confirmed,
        recovered: element.Recovered,
        active: element.Active,
        deaths: element.Deaths,
        date: element.Date.slice(0, 10),
      }
    });

    let oldDates = dataCases.map(element => element.date);
    let formattedDates = alterDateFormat(oldDates);

    let i = 0;
    dataCases = dataCases.map(element => ({...element, date: formattedDates[i++]}) );

    // dataCases = dataCases.slice(dataCases.length - 31, dataCases.length);

    setTemp(dataCases);
    setVisible(true);
    setLoading(false);
  }

  useEffect(async() => {
    let totalCountries = await fetchCountries()

    // Because the data for united states is not showing up on the API, for some reason
    totalCountries = totalCountries.filter(element => element.slug != 'united-states');

    setCountries(totalCountries);
    getCountryData({ value: totalCountries[0].slug })
  }, [])

  return (
    <div className="App">
      <h1 className='heading'>COVID-19 Tracker</h1>
      <h2 id='daddy'>By Zoraiz</h2>

      <hr style={{width: '95%'}}/>

      <div className='selectors'>
        <div className='select-container select-country'>
          <h3>Select Country / Region</h3>
          <Select
            options={ countries.map(country => ({ value: country.slug, label: country.name }) )}
            onChange={ getCountryData }
          />
        </div>
        <div className='lower-row'>
          <section className='select-container select-month'>
            <h3>Select Month</h3>
            
            <div>
              <Select
                options={ [
                  {value: 'ALL YEAR', label: 'ALL YEAR'},
                  {value: 'January', label: 'January'},
                  {value: 'February', label: 'February'},
                  {value: 'March', label: 'March'},
                  {value: 'April', label: 'April'},
                  {value: 'May', label: 'May'},
                  {value: 'June', label: 'June'},
                  {value: 'July', label: 'July'},
                  {value: 'August', label: 'August'},
                  {value: 'September', label: 'September'},
                  {value: 'October', label: 'October'},
                  {value: 'November', label: 'November'},
                  {value: 'December', label: 'December'},
                ] }
                onChange={ (thing) => {
                  if(thing.value != 'ALL YEAR') {
                    setYearlyDisplay(false);
                    setChosenMonth(thing.value);
                  } else {
                    setYearlyDisplay(true);
                  }
                }}
              />
            </div>
          </section>
          <section className='select-container select-year'>
            <h3>Select Year</h3>
            
            <Select
              options={ availableYears.map(year => ({value: year, label: year}) ) }
              onChange={ (thing) => setChosenYear(thing.value)}
            />
          </section>
        </div>
      </div>

      <hr style={{width: '95%'}}/>

      {visible && !yearlyDisplay &&
        <div className='row'>
        <CustomChart
          title={temp[0].name}
          type={'first'}
          graphData={temp.filter(element => element.date.month == chosenMonth && element.date.year == chosenYear)}
          dotRadius={1.2}/>
        <CustomChart
          title={temp[0].name}
          type={'second'}
          graphData={temp.filter(element => element.date.month == chosenMonth && element.date.year == chosenYear)}
          dotRadius={1.2}/> 
        </div>
      }

      {visible && yearlyDisplay &&
        <div className='row'>
        <CustomChart
          title={temp[0].name}
          type={'first'}
          graphData={temp}
          dotRadius={0}/>
        <CustomChart
          title={temp[0].name}
          type={'second'}
          graphData={temp}
          dotRadius={0}/> 
        </div>
      }

      {loading && <Loading className='charts' text={'Loading...'} />}

      {visible &&
        <div className='about'>
        <h2>About</h2>
        <p>
          The data used for the graphs in this project is publicly available
          and was obtained from the COVID 19 API <a href='https://covid19api.com' target='_blank'>here</a>.
          All credits for the data go to the source. Please visit their website and support them if you can.
          <br />
          <br />
          As for the project itself, it's open source and you can view the source code <a href='https://github.com/TheZoraiz/React-COVID19-Tracker' target='_blank'>here</a>

        </p>
      </div>}
    </div>
  );
}

export default App;
