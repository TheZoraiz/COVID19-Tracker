const { count } = require('console');
const fs = require('fs');
const fetch = require('node-fetch');
const { resolve } = require('path');

const fetchCountries = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject('Error!'), 10000);
        fetch('https://api.covid19api.com/summary')
            .then(res => res.json())
            .then(json => {
                json = json.Countries;
                // Array of objects with country names and slugs
                let totalCountries = json.map(element => ({ name: element.Country, slug: element.Slug }));
                resolve([...totalCountries]);
            })
            .catch(() => {
                console.error('Kono error da~!')
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
            .catch(() => {
                reject();
            });
    });
}

const sleep = (time) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), time);
    })
}

const initiate = async() => {
    console.log('Fetching total countries...');
    const countries = await fetchCountries();
    console.log('Countries successfully fetched...');

    console.log('Writing total countries to file...');
    fs.writeFileSync('countries.txt', JSON.stringify(countries));
    console.log('Total countries successfully written...');

    console.log('\nFetching individual country data...');
    
    let date = `${new Date()}`;
    let dir = `./${date.slice(0,15)}`

    if(!fs.existsSync(dir)) {
        console.log('Making this date\'s directory...\n');
        fs.mkdirSync(dir);
    } else {
        console.log('This date\'s directory already exists');
    }

    for(let i = 0; i < countries.length; i ++) {
        if(countries[i].slug == 'united-states')
            continue;
        if(fs.existsSync(`${dir}/${countries[i].name}`)) {
            await sleep(10);
            console.log(`(${i+1}/${countries.length}) ${countries[i].name}'s data already saved...`);
            continue;
        }
        try {
            await sleep(100);
            console.log(`(${i+1}/${countries.length}) Saving ${countries[i].name}'s data...`);
            const country = await fetchCountryData(countries[i].slug);
    
            fs.writeFileSync(`${dir}/${countries[i].name}`, JSON.stringify(country));
        } catch(e) {
            console.log('Error encountered...\nSleeping for 5 seconds...');
            await sleep(5000);
            i--;
            continue;
        }
    }

    console.log('All COVID data saved successfully');
}

initiate();