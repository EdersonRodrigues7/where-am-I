'use strict';
const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const neighboursContainer = document.querySelector('.neighbours');
const msg = document.querySelector('.msg');
const restCountriesUrl = 'https://restcountries.com/v2/alpha/';

const renderCountry = function (data, city) {
  if (city) {
    msg.innerHTML = `You're in ${city}, ${data.name}`;
  }
  const html = `
  <article class="country">
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

const renderNeighbour = function (data) {
  const html = `
  <article class="country neighbour">
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
  neighboursContainer.insertAdjacentHTML('beforeend', html);
  neighboursContainer.style.opacity = 1;
};

const renderError = function (msg) {
  countriesContainer.insertAdjacentText('beforeend', msg);
  countriesContainer.style.opacity = 1;
};

const getCountryJSON = async (url, errorMsg) => {
  try {
    const response = await fetch(url);
    if (response.status === 404) throw new Error(errorMsg);
    return response.json();
  } catch (err) {
    renderError(errorMsg);
    // throw new Error(`${errorMsg} (${response.status})`);
  }
};

const getCountryData = async (code, city) => {
  try {
    const countryData = await getCountryJSON(`${restCountriesUrl}${code}`, 'Country not found 😔');
    console.log(countryData);
    renderCountry(countryData, city);
    if (countryData.borders) {
      for (const neighbour of countryData.borders) {
        const neighbourData = await getCountryJSON(
          `${restCountriesUrl}${neighbour.toLowerCase()}`,
          'Country not found 😔'
        );
        renderNeighbour(neighbourData);
      }
    }

    // const neighbourCode = countryData.borders?.[0].toLowerCase();
    // const neighbourData = await getCountryJSON(
    //   `${restCountriesUrl}${neighbourCode}`,
    //   'Country not found 😔'
    // );
    // renderCountry(neighbourData);
  } catch (err) {
    // renderError(err.message);
  }
};

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const whereAmI = async function () {
  const position = await getPosition();
  const { latitude, longitude } = position.coords;
  const data = await fetch(
    `https://geocode.xyz/${latitude},${longitude}?geoit=json&auth=562264285309734464978x16885`
  );
  const location = await data.json();
  const countryCode = location.prov.toLowerCase();
  // getCountryData(countryCode, location.city);
  getCountryData('eg', ['cairo']);
};

btn.addEventListener('click', function () {
  whereAmI();
});
