import React, {useEffect, useState} from 'react'
import {useNavigate, useSearchParams} from 'react-router-dom'

// components
import EventDetails from '../components/EventDetails'

import {PoshEventObject} from 'interface/poshEventObject'

interface PoshEventsArray extends Array<PoshEventObject>{}

const cities = {
  nyc: {
    long: "-73.935242",
    lat: "40.73061"
  },
  mia: {
    long: "-80.191788",
    lat: "25.761681"
  },
  la: {
    long: "-118.321495",
    lat: "34.134117"
  },
}

type CitiesKey = keyof typeof cities


const ExploreEvents = () => {
  // * SCRIPTS

  // Fetch "Events" Data
  const [poshEvents, setPoshEvents] = useState<PoshEventObject[]>([])

  useEffect(() => {
    const fetchPoshEvents = async () => {
      const response = await fetch('http://localhost:4042/api/events')
      console.log('🐕 Fetch Finished!')

      // Parse the JSON into an array of PoshEvent objects
      const json:PoshEventsArray = await response.json()

      if (response.ok) {
        // Tranisition from 'Loading' screen to filtered events
        setLoading(false)
        console.log('PARAMS city :', newParams.get('city'));
        // Filter JSON Results by 'Near Me'
        if(newParams.get('city')  == 'near'){
          geoLocate()
        } else {
        // Filter JSON Results by City
          filterByCity(json)
        }
      } else {
        console.log('🚨 Something went wrong with data fetch ...')
      }
    }

    fetchPoshEvents()
  }, [])

  // "Back" arrow/button Navigation
  const navigate = useNavigate()

  // Style Nav Button
  const removeSelectedClass = () => {
    const eventButtons: Element[] = Array.from(document.getElementsByClassName('event-select'))
    eventButtons.forEach(button => button.classList.remove('selected'))
  }
  const updateButton = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    removeSelectedClass()
    e.currentTarget.classList.add('selected')
  }

  // Params Hook + Store Params
  const [searchParams, setSearchParams] = useSearchParams()
  let newParams = new URLSearchParams(searchParams.toString())

  // Handle User Time-Range Selection
  const selectTimeRange = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => {
    // Re-Style Buttons
    updateButton(e)

    // Update Params
    id == 'this-week' ? newParams.set('t', 'week') : ''
    id == 'today' ? newParams.set('t', 'today') : ''
    id == 'thanksgiving' ? newParams.set('t', 'thanksgiving') : ''

    // Update 'searchParams'
    setSearchParams(newParams.toString())
  }

  // Filter By City
  const filterByCity = (json:PoshEventsArray) => {
    const cityLongLat = cities[newParams.get('city') as CitiesKey]
    const filteredEvents = json.filter((el) => {
      return (el.location.coordinates[0] == cityLongLat.long && el.location.coordinates[1] == cityLongLat.lat);   
    });
    // Store filtered events (to be itterated-through using eventDetails component)
    setPoshEvents(filteredEvents)
  }

  // GeoLocation
  // interface UserLocation {
  //   latitude: string
  //   longitude: string
  // }

  // "lat" = vertical
  // "long" = horizontal
  const geoLocate = () => {
    if ('geolocation' in navigator) {
      /* geolocation is available */
      console.log('🌍 geolocation found!')

      let userLocation:GeolocationCoordinates 
      // let userLatitude 
      // let userLongitude

      // const getLongAndLat = async () =>{
      //   navigator.geolocation.getCurrentPosition(onSuccess, onError)
      // }

      // const onSuccess = async (position:any) => {
      //   userLatitude = position.coords.latitude;
      //   userLongitude = position.coords.longitude;
      // }

      // function onError(error:any) {
      //   alert('Error: ' + error.message);
      // }

      // const locateButtonFetch = async () => {
      //   await getLongAndLat();
      // }

      let getLocation = () => new Promise((resolve, reject) => 
      navigator.geolocation.getCurrentPosition(resolve, reject));

      const main = async () => {
        try {
          console.log('getting location...');
          let location:any = await getLocation();
          const userLatitude = location.coords.latitude
          const userLongitude = location.coords.longitude
          console.log('got location', userLatitude, userLongitude);
          let city
          // Assign City
          if (
            (userLatitude <= 42 && userLatitude >= 38) 
            && 
            (userLongitude <= 42 && userLongitude >= 38)
            ) {
              console.log(userLatitude, userLongitude, "N.Y.C");
              city = 'nyc'
            } else if ( 
              (userLatitude <= 28 && userLatitude >= 23) 
              && (userLongitude <= 42 && userLongitude >= 38)
            ) {
              console.log(userLatitude, userLongitude, "MIA");
              city = 'mia'
            } else if ( 
              (userLatitude <= 36 && userLatitude >= 32) 
              && 
              (userLongitude <= 42 && userLongitude >= 38)
              ) {
              console.log(userLatitude, userLongitude, "L.A.");
              city = 'la'
            } else {
              console.log(userLatitude, userLongitude, "DEFAULTED to NYC");
              city = 'nyc'
            }
        } catch (e) {
          console.log('ERROR', e.message);
        }
      }


      main()
      
      // console.log('location: ', location);

      // Working (kinda)
      // navigator.geolocation.getCurrentPosition(position => {
      //   userLocation = position.coords
      //   userLatitude = position.coords.latitude
      //   userLongitude = position.coords.longitude
      //   console.log('🎯 User lat, long: ', userLatitude, userLongitude)
      // })

      // if(userLocation.longitude < -100) {
      //   console.log('LA')
      // }
      // if (userLocation.longitude > -100 && userLocation.latitude > 32) {
      //   console.log('NYC');
      // } else {
      //   console.log('MIA');
      // }
    } else {
      /* geolocation IS NOT available */
      console.log('🌍❌ geolocation NOT found ...')
    }
  }

  // Handle Loading
  const [loading, setLoading] = useState(true)

  // * TEMPLATE
  return (
    <div>
      {/* Event Content */}
      <div className='explore'>
        <video
          autoPlay={true}
          loop={true}
          className='explore-video false'
          src='https://posh-b2.s3.us-east-2.amazonaws.com/meta+(1).mp4'></video>
        <div className='explore-cover'>
          <video
            autoPlay={true}
            playsInline={true}
            loop={true}
            className='explore-cover-video false'
            src='https://posh-b2.s3.us-east-2.amazonaws.com/meta+(1)_1.mp4'></video>
        </div>
        <div className='explore-body'>
          <div className='explore-body-main'>
            <div className='explore-body-main-nav'>
              <div className='explore-body-main-nav-right'>
                <div className='event-select selected' onClick={e => selectTimeRange(e, 'this-week')}>
                  This Week
                </div>
                <div className='event-select' onClick={e => selectTimeRange(e, 'today')}>
                  Today
                </div>
                <div className='event-select' onClick={e => selectTimeRange(e, 'thanksgiving')}>
                  🦃 Thanksgiving
                </div>
              </div>
            </div>
            <div className='explore-body-main-results event-card-grid'>
              {poshEvents && poshEvents.map(poshEvent => <EventDetails key={poshEvent._id} poshEvent={poshEvent} />)}
            </div>
          </div>
        </div>
      </div>

      {/* "Back" Button */}
      <button onClick={() => navigate('/explore')}>
        <img
          src='https://posh-b2.s3.us-east-2.amazonaws.com/left-arrow-in-circular-button-black-symbol.svg'
          className='explore-back'></img>
      </button>

      {/* "Loading" placeholder*/}
      <div className={loading ? 'explore-loader no-pointer' : 'explore-loader no-pointer fade-out'}>
        <canvas width='942' height='1048'></canvas>
        <div className='explore-loader-inner'>
          <div className='explore-loader-text '>Finding the best events for you...</div>
          <div className='explore-loader-load-bar '>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExploreEvents
