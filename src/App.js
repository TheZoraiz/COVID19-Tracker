import './App.css';
import { useState, useEffect } from 'react'
import Select from 'react-select';
import DatePicker from 'react-date-picker';
import ReactGA from 'react-ga';

import DoubleLineChart from './components/DoubleLineChart.js'
import Loading from './components/Loading.js'
import SingleLineChart from './components/SingleLineChart';
import { fetchCountries, fetchCountryData } from './components/FetchMethods.js';
import { alterDateFormat, getDataInRange } from './components/OtherMethods.js';

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

  const [ error, setError ] = useState(false);

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
    x.setDate(x.getDate() + 1);
    // console.log('Lower Limit: ', x);
    setSecondPickerMinDate(x);

    rangeSetter(selectedDate, null);
  }

  const onSecondDateChange = (selectedDate) => {

    let y = new Date(selectedDate.getTime());
    y.setDate(y.getDate() - 1);
    setFirstPickerMaxDate(y);

    setSecondDate(selectedDate);
    rangeSetter(null, selectedDate);
  }

  const rangeSetter = (first, second) => {
    let dataInRange = getDataInRange(first, second, firstDate, secondDate, temp);
    setTemp2(dataInRange);
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
    try {
      let totalCountries = await fetchCountries()

      // Because the data for united states is not showing up on the API, for some reason
      totalCountries = totalCountries.filter(element => element.slug != 'united-states');

      setCountries(totalCountries);
      
      getCountryData({ value: 'pakistan' })

    } catch(e) {
      console.log(e);
      setError(true);
      setVisible(false);
      setLoading(false);
    }
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

        {loading && <Loading className='charts' text={'Loading...'} />}

        {error &&
          <div className='error-wrapper'>
            <h1>Error!</h1>
            <p>
              There was an error retrieving the data.
              <br/>
              Please refresh the page or try again after a few minutes.
            </p>
          </div>
        }
        <div className='about-wrapper'>
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
    </div>
  );
}

export default App;
