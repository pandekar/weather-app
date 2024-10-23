const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export function fetchWeather(city) {
  return fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Weather data not found');
      }

      return response.json();
    })
    .then(data => data)
    .catch(error => {
      console.error('Error fetching weather data:', error);

      return { code: '404', message: error.message };
    });
};

export async function fetchCurrenLocationWeather(latitude, longitude) {
  try {
    const data = await fetch(`${BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);

    if (!data.ok) {
      throw new Error('Weather data not found');
    }

    return data.json();
  } catch(error) {
    console.error('Error fetching weather data:', error);

    return { code: '404', message: error.message };
  }
};
