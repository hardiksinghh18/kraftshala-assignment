import logo from './logo.svg';
import './App.css';
import axios from 'axios'
import { useEffect, useState } from 'react';
import haze from './assets/weather-app (1).png'
import clear from './assets/weather-app (2).png'
import rain from './assets/weather-app (3).png'
import thunder from './assets/thunder.png'

function App() {
  const [data, setData] = useState({})
  const [location, setLocation] = useState('')
  const [userData, setUserData] = useState({})
  const [userLocation, setUserLocation] = useState('')
  const [countryCode, setCountryCode] = useState('')
  const [userTemp, setUserTemp] = useState()
  const [time, setTime] = useState('')
  const [dayDate, setDayDate] = useState('')
  const [weatherCondition, setWeatherCondition] = useState('')
  const [weatherDetails, setWeatherDetails] = useState('')
  const [loading,setLoading]=useState(false)

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=b1d4bfa74ced4e2f24cfa94f70460251`


  //handle input search
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
 
      // setLoading(true)
      const res = await axios.get(url)

      setData(res?.data)
      setWeatherCondition(res?.data?.weather[0]?.main)
      setWeatherDetails(res?.data?.weather[0]?.description)
      
      setLocation('')
      // setLoading(false)
    } catch (error) {
      console.log(error)
    }

  }


  //get weather updates of user's location
  const fetchDefault = async (lat, lon) => {

    try {

      setLoading(true)
      const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=b1d4bfa74ced4e2f24cfa94f70460251`)

      setData(res?.data)
      setUserLocation(res?.data?.name)
      setCountryCode(res?.data?.sys?.country)
      setUserTemp(res?.data?.main?.temp)


      setWeatherCondition(res?.data?.weather[0]?.main)
      setWeatherDetails(res?.data?.weather[0]?.description)
      
      setLocation('')
      setLoading(false)

      // console.log(res.data.main.temp)

    } catch (error) {
      console.log(error)
    }

  }


  //get user's location

  const getLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const lat = position.coords.latitude 
          const lon = position.coords.longitude 


          fetchDefault(lat, lon)
        },
        error => {
          console.log('Error occurred while getting location.');
          console.error(error);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  };


  useEffect(() => {
    getLocation()

  }, [])




  //fetch time and date


  function updateDateTime() {
    const now = new Date();

    // Get the current time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const time = `${hours}:${minutes}:${seconds}`;
   setTime(time)
    // Get the current day and date
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const day = daysOfWeek[now.getDay()];

    const dayOfMonth = String(now.getDate()).padStart(2, '0');
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    const date = `${dayOfMonth} ${month} ${year}`;


    const dayDate= `${day}, ${date}`;
    setDayDate(dayDate)

  }

  // Update the date and time immediately when the page loads
  useEffect(()=>{
  updateDateTime();

})
  // Update the date and time every second
  setInterval(updateDateTime, 1000);



  const weatherImages = {
    Clear: clear,
    Clouds: haze,
    Rain: rain,
    Haze: haze,
    Thunderstorm: thunder,
    Drizzle: rain,
    Mist: haze
  };



  const imageUrl = weatherImages[weatherCondition] || clear;




  if(loading){
    return (
      <div className='loading'>Loading...</div>
    )
  }

  return (
    <div className='mainBody'>
      <div className="overlay"></div>


      <div className="displayBox">
        <div className='section1'>
          <form action="" onSubmit={handleSubmit}>
            <input type="text" name='search' placeholder='Enter your location' onChange={(e) => setLocation(e.target.value.toLowerCase())} />
            <button type='submit'><i class='bx bx-search'></i></button>
          </form>

          {data && <div className='maindiv'>
            <div className='city-temp'>
              <h2>{data?.name},{data?.sys?.country}</h2>
              <h3>{Math.floor((data?.main?.temp - 32) * 5 / 9)}&deg;C</h3>
            </div>

            <div className="image">
              <img src={imageUrl} alt="" />
            </div>

           { weatherDetails&& <h3>{weatherDetails}</h3>}
          </div>}

          {/* <div className="cloud"><i class='bx bxs-cloud-rain'></i></div> */}

          <div className='bottom'>
            <div className='flex-col'>
              {/* <h2 id='time'></h2> */}
              <h3>{time}</h3>
              <h3>{dayDate}</h3>
            </div>

            {userLocation && <div>
              <h3>{userLocation},{countryCode}</h3>
              <h2>{Math.floor((userTemp - 32) * 5 / 9)}&deg;C</h2>
            </div>}
          </div>
        </div>
        <div className='section2'>

          {data && <div className='city-weather'>

            <div className='city'><h2>{data?.name},{data?.sys?.country}</h2></div>
            <h2>{weatherCondition}</h2>
          </div>}

          <hr />
          <div className="feels-like space-between">
            <h4>Feels like  </h4>
            <h4>{Math.floor((data?.main?.feels_like - 32) * 5 / 9)}&deg;C</h4>
          </div>
          <hr />
          <div className="min-temp space-between">
            <h4>Min-temp  </h4>
            <h4>{Math.floor((data?.main?.temp_min - 32) * 5 / 9)}&deg;C</h4>
          </div>

          <hr />
          <div className="max-temp space-between">
            <h4>Max-temp  </h4>
            <h4>{Math.floor((data?.main?.temp_max - 32) * 5 / 9)}&deg;C</h4>
          </div>

          <hr />
          <div className="humidity space-between">
            <h4>Humidity  </h4>
            <h4>{data?.main?.humidity}%</h4>
          </div>
          <hr />
          <div className="visisbility space-between">
            <h4>Visibility  </h4>
            <h4>{(data?.visibility) / 1000}km</h4>
          </div>
          <hr />
          <div className="wind space-between">
            <h4>Wind Speed  </h4>
            <h4>{data?.wind?.speed}km/h</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
