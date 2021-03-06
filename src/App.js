import './App.css';
import { useState, useEffect } from 'react'
import Select from 'react-select';
import DatePicker from 'react-date-picker';
import ReactGA from 'react-ga';

import DoubleLineChart from './components/DoubleLineChart.js'
import Loading from './components/Loading.js'
import SingleLineChart from './components/SingleLineChart';

import { fetchCountries, fetchCountryData } from './fetchMethods.js';
import { alterDateFormat, rangeSetter } from './utilMethods.js';
const Constants = require('./Constants.js')

const App = () => {
  const [ visible, setVisible ] = useState(false);
  const [ temp, setTemp ] = useState([]);
  const [ temp2, setTemp2 ] = useState([]);
  const [ countries, setCountries ] = useState([]);
  const [ loading, setLoading ] = useState(true);

  const [ firstRecordDate, setFirstRecordDate ] = useState();
  const [ secondRecordDate, setSecondRecordDate ] = useState();
  const [ secondPickerMinDate, setSecondPickerMinDate ] = useState(null);
  const [ firstPickerMaxDate, setFirstPickerMaxDate ] = useState(null);

  const [ firstDate, setFirstDate ] = useState(new Date());
  const [ secondDate, setSecondDate ] = useState(new Date());

  const [ showMessage, setShowMessage ] = useState(false)
  const [ error, setError ] = useState(false);

  const getCountryData = async(country) => {
    setLoading(true)
    ReactGA.event({
      category: 'User',
      action: `Changed country to ${country.value}`,
    });

    let data;
    try {
      data = await fetchCountryData(Constants.officialAPICountry, country.value);
      setShowMessage(false);
    } catch(e) {
      try {
        data = await fetchCountryData(Constants.backupServerURL, country.value);
        setShowMessage(true)
      } catch(e) {
        ReactGA.event({
          category: 'User',
          action: 'Fetching per country backup failed'
        })
        setError(true);
        setVisible(false);
        setLoading(false);
        return;
      }
      ReactGA.event({
        category: 'User',
        action: 'Fetching per country API failed'
      })
    }

    let dataCases = data.map(element => {
      return {
        name: element.Country,
        confirmed: element.Confirmed,
        recovered: element.Recovered,
        active: element.Active,
        deaths: element.Deaths,
        date: element.Date.slice(0, 10),
        province: element.Province,
      }
    });


    let filtered = dataCases.filter(element => element.province === '');
    if(filtered.length == 0) {  

      let tempDate = dataCases[0].date;
      let part = [];
      dataCases.forEach(element => {
        if(element.date == tempDate)
          part.push(element);
        else {
          tempDate = element.date;
          filtered.push([...part]);
          part = [];
        }
      })
      
      let moreFiltered = [];

      console.log(filtered);
      filtered.forEach(array => {
        let tempCase = {
          confirmed: 0,
          recovered: 0,
          active: 0,
          deaths: 0,
        };
        array.forEach(element => {
          tempCase = {
            ...element,
            confirmed: tempCase.confirmed + element.confirmed,
            recovered: tempCase.recovered + element.confirmed,
            active: tempCase.active + element.active,
            deaths: tempCase.deaths + element.deaths,
          }
        })
        moreFiltered.push(tempCase);
        tempCase = {};
      })
      dataCases = [...moreFiltered];
    } else {
      dataCases = [...filtered];
    }

    // console.log(filtered)
    // dataCases = [...filtered]

    let oldDates = dataCases.map(element => element.date);
    let formattedDates = alterDateFormat(oldDates);


    let i = 0;
    dataCases = dataCases.map(element => ({...element, newDate: formattedDates[i++]}) );

    let firstCase = dataCases[0];
    let lastCase = dataCases[dataCases.length - 1];

    setFirstRecordDate(new Date(`${firstCase.newDate.year}-${firstCase.newDate.monthNum}-${firstCase.newDate.day}`));
    setSecondRecordDate(new Date(`${lastCase.newDate.year}-${lastCase.newDate.monthNum}-${lastCase.newDate.day}`));
    
    let lastMonthDataCases = dataCases.slice(dataCases.length - 30, dataCases.length);

    setTemp(dataCases);

    setTemp2(lastMonthDataCases);
    setDefaultDates(lastMonthDataCases);

    setVisible(true);
    setLoading(false);
    document.getElementsByClassName('about-wrapper')[0].style.marginTop = '20px';
  }

  const onFirstDateChange = (selectedDate) => {
    ReactGA.event({
      category: 'User',
      action: `Changed starting date to ${selectedDate.toLocaleString()}`
    });

    setFirstDate(selectedDate);

    // So that you can't select a date BEFORE first date
    let x = new Date(selectedDate.getTime());
    x.setDate(x.getDate() + 1);
    // console.log('Lower Limit: ', x);
    setSecondPickerMinDate(x);

    setTemp2(rangeSetter(selectedDate, null, firstDate, secondDate, temp))
  }

  const onSecondDateChange = (selectedDate) => {
    ReactGA.event({
      category: 'User',
      action: `Changed ending date to ${selectedDate.toLocaleString()}`
    });

    let y = new Date(selectedDate.getTime());
    y.setDate(y.getDate() - 1);
    setFirstPickerMaxDate(y);

    setSecondDate(selectedDate);
    setTemp2(rangeSetter(null, selectedDate, firstDate, secondDate, temp))
  }

  const setDefaultDates = (lastMonthDataCases) => {
    
    let first = new Date(lastMonthDataCases[0].date);
    let second = new Date(lastMonthDataCases[lastMonthDataCases.length - 1].date);
    

    let tempFirst = new Date(lastMonthDataCases[0].date);
    setFirstDate(tempFirst);
    
    // Setting date limits for each date-picker
    first.setDate(first.getDate() + 1);
    second.setDate(second.getDate() - 1);

    setSecondPickerMinDate(first);
    setFirstPickerMaxDate(second);
  }

  useEffect(async() => {
    ReactGA.initialize(Constants.GoogleAnalyticsTag);
    ReactGA.pageview('/');

    let totalCountries;
    try {
      totalCountries = await fetchCountries(Constants.officialAPI);
      setShowMessage(false);
      setError(false);
    } catch(e) {
      try {
        totalCountries = await fetchCountries(Constants.backupServerCountriesURL);
        setShowMessage(true);
        setError(false);
      } catch(e) {
        ReactGA.event({
          category: 'User',
          action: 'Fetching countries backup server failed'
        })
        setError(true);
        setVisible(false);
        setLoading(false);
        document.getElementsByClassName('about-wrapper')[0].style.marginTop = '20px';
        return;
      }
      ReactGA.event({
        category: 'User',
        action: 'Fetching countries API failed'
      })
    }

      // Because the data for united states is not showing up on the API, for some reason
      totalCountries = totalCountries.filter(element => element.slug != 'united-states');

      setCountries(totalCountries);
      
      getCountryData({ value: 'pakistan' })
  }, [])

  return (
    <div className="App">
      <div id='first-section'>
        <h1 className='heading'>COVID-19 Tracker</h1>
        <h3 id='tagline'>Stay Home & Stay Safe</h3>

        <hr style={{width: '95%'}}/>

        <div className='selectors'>
          <div className='select-container'>
            <h3>Select Country / Region</h3>
            <Select
              options={ countries.map(country => ({ value: country.slug, label: country.name }) )}
              defaultValue={ ({value: 'pakistan', label: 'Pakistan'}) }
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
                maxDate={firstPickerMaxDate}
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
        {showMessage &&
          <div>
            <p className='warningMessage'>Data fetched from the backup server because the official API threw an error</p>
            <p className='warningMessage'>(Latest dates may not be available) </p>
          </div>
        }

        {loading && <Loading className='charts' text={'Loading...'} />}


        {visible &&
          <div className='row'>
            <DoubleLineChart
              country={temp[0].name}
              title={'Cases & Recoveries'}
              firstLabel='Total Cases'
              secondLabel='Total Recoveries'
              graphData={temp2}
              dotRadius={0}
            />
            <SingleLineChart
              country={temp[0].name}
              title={'Active Cases'}
              type='Active'
              label='Active Cases'
              graphData={temp2}
              color='orange'
              dotRadius={0}
            /> 
            <SingleLineChart
              country={temp[0].name}
              title={'Total Deaths'}
              type='Deaths'
              label='Total Deaths'
              graphData={temp2}
              color='red'
              dotRadius={0}
            /> 
          </div>
        }

        {error &&
          <div className='error-wrapper'>
            <h1>Error!</h1>
            <p>
              There was an error retrieving the data. Both the official API and backup server seem to be unresponsive.
              <br/>
              <br/>
              Please refresh the page or try again after a few minutes.
            </p>
          </div>
        }
        <div className='about-wrapper'>
          <h2>About</h2>
          <p>Note: Any irregularities in the graphs are solely caused by data fetched from the API.
            Countries with separate data for each province have different provinces' numbers added into a single date.</p>
          <p>
            The data used for the graphs in this project is publicly available
            and was obtained from the COVID 19 API <a href='https://covid19api.com' target='_blank' onClick={()=> 
                ReactGA.event({
                  category: 'User',
                  action: 'Clicked official API\'s link'
                })
            }>here</a>.
            All credits for the data go to the source. Please visit their website and support them if you can.
            <br />
            <br />
            The project is open source and you can view the front end code <a href='https://github.com/TheZoraiz/React-COVID19-Tracker' target='_blank' onClick={()=> 
                ReactGA.event({
                  category: 'User',
                  action: 'Clicked frontend link'
                })
            }>here</a> and the backup server's code <a href='https://github.com/TheZoraiz/COVID19-Tracker-Backend' target='_blank' onClick={()=> 
                ReactGA.event({
                  category: 'User',
                  action: 'Clicked backup server\'s link'
                })
        }>here.</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
