import { fetchWeather } from './weatherApi.js';

const STORAGE_KEY = 'WEATHER_APP';

class WeatherApp {
  constructor() {
    this.searchBtn = document.getElementById('search-btn');
    this.cityInput = document.getElementById('city-input');
    this.weatherContainer = document.getElementById('weather-container');
    this.historyList = document.getElementById('history-list');
    this.searchHistory = [];

    this.init();
  };

  init() {
    this.searchBtn.addEventListener('click', () => this.handleSearch());
    this.cityInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.handleSearch();
      
        this.cityInput.value = '';
      }
    });
    this.historyList.addEventListener('click', (e) => this.handleHistoryClick(e));

    // Check for city in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const cityParams = urlParams.get('city');

    if (cityParams) {
      this.cityInput.value = cityParams;

      this.handleSearch();
    }

    if (this.isLocalStorageExist()) {
      this.loadLocalStorage();
    }
  };

  isLocalStorageExist() {
    if (typeof (Storage) === undefined) {
      alert('your browser does not support local storage');
      return false;
    }
  
    return true;
  };

  loadLocalStorage() {
    const parsedData = JSON.parse(localStorage.getItem(STORAGE_KEY));

    this.searchHistory = [...parsedData];
    this.updateHistoryList();
  };

  async handleSearch() {
    const city = this.cityInput.value.trim();

    if (city) {
      try {
        const result = await fetchWeather(city);

        this.displayWeather(result);
        this.addToHistory(result);
        this.updateURL(result);
      } catch (error) {
        console.error('Error in handleSearch', error);

        this.weatherContainer.innerHTML = `<p>An error occured. Please try again</p>`;
      }
    }
  };

  displayWeather(data) {
    if (data.code === '404') {
      this.weatherContainer.innerHTML = `<p>City not found. Please try again</p>`;

      return;
    }

    const weatherHtml = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p>Temperature: ${Math.round(data.main.temp - 273.15)} C</p>
      <p>Weather: ${data.weather[0].description}</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;

    this.weatherContainer.innerHTML = weatherHtml;
  };

  addToHistory(city) {
    if (city.code !== '404') {
      if (!this.searchHistory.includes(city.name)) {
        this.searchHistory.unshift(city.name);
  
        if (this.searchHistory.length > 5) {
          this.searchHistory.pop();
        }
  
        this.updateHistoryList();
      }
  
      if (this.isLocalStorageExist()) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.searchHistory));
      }
    }
  };

  updateHistoryList() {
    this.historyList.innerHTML = this.searchHistory
      .map(city => `<li>${city}</li>`)
      .join('');
  };

  handleHistoryClick(e) {
    if (e.target.tagName === 'LI') {
      this.cityInput.value = e.target.textContent;

      this.handleSearch();
    }
  };

  updateURL(city) {
    const url = new URL(window.location);
    url.searchParams.set('city', city.name);
    window.history.pushState({}, '', url);
  };
};

const app = new WeatherApp();
