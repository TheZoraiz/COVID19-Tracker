const fetch = require('node-fetch');

const fetchCountries = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject('Error!'), 10000);
    fetch('https://api.covid19api.com/summary')
      .then(res => res.json())
      .then(json => {
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

module.exports = {
    fetchCountries,
    fetchCountryData,
}