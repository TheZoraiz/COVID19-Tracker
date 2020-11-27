import './App.css';
import { useState, useEffect } from 'react'
import Select from 'react-select';
import DatePicker from 'react-date-picker';
import ReactGA from 'react-ga';

import DoubleLineChart from './components/DoubleLineChart.js'
import Loading from './components/Loading.js'
import SingleLineChart from './components/SingleLineChart';
const fetch = require('node-fetch');


const fetchCountries = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject('Error!'), 10000);
    fetch('https://api.covid19api.com/summary')
      .then(res => res.json())
      .then(json => {
        console.log(json);
        json = json.Countries;
        // Array of objects with country names and slugs
        let totalCountries = json.map(element => ({name: element.Country, slug: element.Slug}) );
        resolve([...totalCountries]);
      })
      .catch(error => {
        setTimeout(() => reject(error), 5000);
      });
  }); 
}

const fetchCountryData = (country) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject('Error!'), 5000);
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
  const [ temp2, setTemp2 ] = useState([]);
  const [ countries, setCountries ] = useState([]);
  const [ loading, setLoading ] = useState(true);

  const [ firstRecordDate, setFirstRecordDate ] = useState();
  const [ secondRecordDate, setSecondRecordDate ] = useState();
  const [ secondPickerMinDate, setSecondPickerMinDate ] = useState(null);

  const [ firstDate, setFirstDate ] = useState(new Date());
  const [ secondDate, setSecondDate ] = useState(new Date());

  const [ error, setError ] = useState(false);

  const alterDateFormat = (dates) => {
    let formatted = [];
    let totalYears = [];

    dates.forEach(date => {
      let day = date.slice(8, date.length);
      let month = date.slice(5, 7);
      let year = date.slice(0, 4);

      if(totalYears[totalYears.length - 1] !== year)
        totalYears.push(year);

      switch(month) {
        case '01':
          formatted.push({month: 'January', monthNum: '01', year: year, day: day, date: `${day} Jan ${year}`});
          break;
        case '02':
          formatted.push({month: 'February', monthNum: '02', year: year, day: day, date: `${day} Feb ${year}`});
          break;
        case '03':
          formatted.push({month: 'March', monthNum: '03', year: year, day: day, date: `${day} March ${year}`});
          break;
        case '04':
          formatted.push({month: 'April', monthNum: '04', year: year, day: day, date: `${day} April ${year}`});
          break;
        case '05':
          formatted.push({month: 'May', monthNum: '05', year: year, day: day, date: `${day} May ${year}`});
          break;
        case '06':
          formatted.push({month: 'June', monthNum: '06', year: year, day: day, date: `${day} June ${year}`});
          break;
        case '07':
          formatted.push({month: 'July', monthNum: '07', year: year, day: day, date: `${day} July ${year}`});
          break;
        case '08':
          formatted.push({month: 'August', monthNum: '08', year: year, day: day, date: `${day} Aug ${year}`});
          break;
        case '09':
          formatted.push({month: 'September', monthNum: '09', year: year, day: day, date: `${day} Sept ${year}`});
          break;
        case '10':
          formatted.push({month: 'October', monthNum: '10', year: year, day: day, date: `${day} Oct ${year}`});
          break;
        case '11':
          formatted.push({month: 'November', monthNum: '11', year: year, day: day, date: `${day} Nov ${year}`});
          break;
        case '12':
          formatted.push({month: 'December', monthNum: '12', year: year, day: day, date: `${day} Dec ${year}`});
          break;
      }
    });

    // console.log(formatted);
    return formatted;
  }

  const getCountryData = async(country) => {
    try {
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

      let firstCase = dataCases[0];
      let lastCase = dataCases[dataCases.length - 1];

      setFirstRecordDate(new Date(`${firstCase.date.year}-${firstCase.date.monthNum}-${firstCase.date.day}`));
      setSecondRecordDate(new Date(`${lastCase.date.year}-${lastCase.date.monthNum}-${lastCase.date.day}`));

      setTemp(dataCases);

      // Selects the most recent month's cases
      let lastMonthDataCases = dataCases.filter(element => element.date.year == lastCase.date.year
        && element.date.monthNum == lastCase.date.monthNum
        && parseInt(element.date.day) <= parseInt(lastCase.date.day));

      setTemp2(lastMonthDataCases);

      setVisible(true);
      setLoading(false);

    } catch(e) {
      console.log(e);
      setError(true);
      setVisible(false);
      setLoading(false);
    }
  }

  const onFirstDateChange = (selectedDate) => {
    setFirstDate(selectedDate);

    // So that you can't select a date BEFORE first date
    let x = new Date(selectedDate.getTime());
    x.setDate(x.getDate() + 2);
    setSecondPickerMinDate(x)

    rangeSetter(selectedDate, null);
  }

  const onSecondDateChange = (selectedDate) => {
    setSecondDate(selectedDate);
    rangeSetter(null, selectedDate);
  }

  const rangeSetter = (first, second) => {
    // Condition because state changers don't immediatelly alter state
    if(first == null)
      first = firstDate;
    else if (second == null)
      second = secondDate;    
    
    let startDay = first.getDate();
    let startMonth = first.getMonth() + 1;
    let startYear = first.getFullYear();

    let endDay = second.getDate();
    let endMonth = second.getMonth() + 1;
    let endYear = second.getFullYear();

    let arr = [];

    temp.forEach(element => {
      let tempDay = parseInt(element.date.day);
      let tempMonth = parseInt(element.date.monthNum);
      let tempYear = parseInt(element.date.year);

      if(tempMonth >= startMonth && tempMonth <= endMonth) {

        if(tempYear >= startYear && tempYear <= endYear) {
          if(startMonth != endMonth) {
            if(tempMonth == startMonth) {
              if(tempDay >= startDay)
                arr.push(element)
            } else if(tempMonth == endMonth) {
              if(tempDay <= endDay)
                arr.push(element);
            } else {
              arr.push(element);
            }
          } else {
            if(tempDay >= startDay && tempDay <= endDay)
              arr.push(element);
          }
        }
      }

    });
    // console.log(arr);
    setTemp2(arr);
  }

  useEffect(async() => {
    try {
      let totalCountries = await fetchCountries()

      // Because the data for united states is not showing up on the API, for some reason
      totalCountries = totalCountries.filter(element => element.slug != 'united-states');

      setCountries(totalCountries);
      
      getCountryData({ value: totalCountries[0].slug })
      
      let x = new Date();
      let firstMonthDay = new Date(x.getFullYear(), x.getMonth(), 1);
      
      setFirstDate(firstMonthDay)

      // So that you can't select a date BEFORE first date
      let x2 = new Date(firstMonthDay.getTime());
      x2.setDate(x2.getDate() + 2);
      setSecondPickerMinDate(x2)

    } catch(e) {
      console.log(e);
      setError(true);
      setVisible(false);
      setLoading(false);
    }
  }, [])

  return (
    <div className="App">
      <h1 className='heading'>COVID-19 Tracker</h1>
      <h2 id='daddy'>By Zoraiz</h2>

      <hr style={{width: '95%'}}/>

      <div className='selectors'>
        <div className='select-container'>
          <h3>Select Country / Region</h3>
          <Select
            options={ countries.map(country => ({ value: country.slug, label: country.name }) )}
            onChange={ getCountryData }
          />
        </div>
        <div className='date-picker-wrapper'>
          <div className='date-picker'>
            <h3>From</h3>
            <DatePicker
              format='dd-MM-y'
              onChange={onFirstDateChange}
              value={firstDate}
              clearIcon={null}
              minDate={firstRecordDate}
              maxDate={secondRecordDate}
              className='picker'
            />
          </div>
          <div className='date-picker'>
            <h3>To</h3>
            <DatePicker
              format='dd-MM-y'
              onChange={onSecondDateChange}
              value={secondDate}
              clearIcon={null}
              minDate={secondPickerMinDate}
              maxDate={secondRecordDate}
              className='picker'
            />
            </div>
        </div>
      </div>

      <hr style={{width: '95%'}}/>

      {visible &&
        <div className='row'>
          <DoubleLineChart
            title={`${temp[0].name} Cases & Recoveries`}
            firstLabel='Total Cases'
            secondLabel='Total Recoveries'
            graphData={temp2}
            dotRadius={0}
          />
          <SingleLineChart
            title={`${temp[0].name} Active Cases`}
            type='Active'
            label='Active Cases'
            graphData={temp2}
            color='orange'
            dotRadius={0}
          /> 
          <SingleLineChart
            title={`${temp[0].name} Total Deaths`}
            type='Deaths'
            label='Total Deaths'
            graphData={temp2}
            color='red'
            dotRadius={0}
          /> 
        </div>
      }

      {loading && <Loading className='charts' text={'Loading...'} />}

      {error &&
        <div className='error-wrapper'>
          <h1>Error!</h1>
          <p>
            There was an error retrieving the data.
            Please refresh the page or try again after a few minutes.
          </p>
        </div>
        }
      <div className='about'>
        <h2>About</h2>
        <p>
          The data used for the graphs in this project is publicly available
          and was obtained from the COVID 19 API <a href='https://covid19api.com' target='_blank'>here</a>.
          All credits for the data go to the source. Please visit their website and support them if you can.
          <br />
          <br />
          The project is open source and you can view the source code <a href='https://github.com/TheZoraiz/React-COVID19-Tracker' target='_blank'>here</a>

        </p>
      </div>
    </div>
  );
}

export default App;
