const fetch = require('node-fetch');

const fetchCountries = (url) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject('Error!'), 10000);
    fetch(url)
      .then(res => res.json())
      .then(json => {
        json = json.Countries;
        // Array of objects with country names and slugs
        let totalCountries = json.map(element => ({name: element.Country, slug: element.Slug}) );
        resolve([...totalCountries]);
      })
      .catch(error => {
          reject(error)
      });
  }); 
}

const fetchCountryData = (url, country) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject('Error!'), 5000);
    fetch(`${url}${country}`)
      .then(res => {
        console.log(res)
        return res.json()
      })
      .then(json => {
        console.log(json)
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