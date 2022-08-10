'use strict';
const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const msg = document.querySelector('.msg');

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)} M people</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>
  `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

const getCountryJSON = function (url, errorMsg = 'Something went wrong 😭') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
    return response.json();
  });
};

const getCountryData = function (code) {
  getCountryJSON(`https://restcountries.com/v2/alpha/${code}`, 'Country not found 😔')
    .then(country => {
      renderCountry(country);
      const neighbourCode = country.borders?.[0].toLowerCase();
      return getCountryJSON(
        `https://restcountries.com/v2/alpha/${neighbourCode}`,
        'Country not found 😔'
      );
    })
    .then(neighbour => {
      renderCountry(neighbour, 'neighbour');
    })
    .catch(err => {
      console.log(err);
      renderError(err.message);
    });
};

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = function () {
  getPosition()
    .then(pos => {
      const { latitude, longitude } = pos.coords;
      return fetch(`https://geocode.xyz/${latitude},${longitude}?geoit=json&auth=${GEOCODE_KEY}`);
    })
    .then(response => {
      if (response.status === '403') throw new Error('Too many requests!');
      return response.json();
    })
    .then(data => {
      msg.innerHTML = `You're in ${data.city}, ${data.country}`;
      return data.prov.toLowerCase();
    })
    .then(code => getCountryData(code))
    .catch(err => {
      console.log(err);
    });
};

btn.addEventListener('click', function () {
  whereAmI();
  // whereAmI('52.508', '13.381');
  // whereAmI('19.037', '72.873');
  // whereAmI('-33.933', '18.474');
});
