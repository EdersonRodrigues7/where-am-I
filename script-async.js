'use strict';
const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const msg = document.querySelector('.msg');
const restCountriesUrl = 'https://restcountries.com/v2/alpha/';

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

const getCountryJSON = async (url, errorMsg) => {
  try {
    const response = await fetch(url);
    return response.json();
  } catch (err) {
    throw new Error(`${errorMsg} (${response.status})`);
  }
};

const getCountryData = async code => {
  try {
    const countryData = await getCountryJSON(`${restCountriesUrl}${code}`, 'Country not found 😔');
    renderCountry(countryData);
    const neighbourCode = countryData.borders?.[0].toLowerCase();
    const neighbourData = await getCountryJSON(
      `${restCountriesUrl}${neighbourCode}`,
      'Country not found 😔'
    );
    renderCountry(neighbourData);
  } catch (err) {
    renderError(err.message);
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
  msg.innerHTML = `You're in ${location.city}, ${location.country}`;
  getCountryData(countryCode);
};

btn.addEventListener('click', function () {
  whereAmI();
});
