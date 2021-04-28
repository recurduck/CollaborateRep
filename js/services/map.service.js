
export const mapService = {
    initMap,
    addMarker,
    panTo,
    map: gMap,
    getMarkers,
    getGeocode,
    getWeather,
    copyUrl
}

let gMarkers = []

let currPos;
let posToUrl;

var gMap;

function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            console.log('google available');
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap);
            gMap.addListener('click', (e) => {
                const loc = {
                    lat: e.latLng.lat(),
                    lng: e.latLng.lng()
                }
                gMarkers.push(loc)
                return addMarker(loc)
            })
        })
    }
    
    function addMarker(loc) {
        if (currPos) currPos.setMap(null)
        var marker = new google.maps.Marker({
            position: loc,
            map: gMap,
        });
        currPos = marker
        posToUrl = {
            lat:(marker.position.lat()) ? marker.position.lat() : loc.lat,
            lng:(marker.position.lng()) ? marker.position.lng() : loc.lng
        }
        panTo(loc.lat, loc.lng)
    return Promise.resolve(marker)
}


function panTo(lat, lng) {
    var latLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(latLng);
}

function getMarkers() {
    return Promise.resolve(gMarkers)
}

function getWeather(lat, lon) {
    const API_KEY = 'f2b3cb7843280e2a382be6dd4bd011e4'
    const prm = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=matric`)
        .then(res => {
            //res.data.weather //gives you an array with all sort of stuff
            return _convertToCelsius(res.data.main)
        })
        .then(res => {
            return res
        })
    return prm
}

function getGeocode(address) {
    if (address) {
        const GEO_KEY = 'AIzaSyARh9KjQvI2E01yjvxzeozkaiNT3QflJFs'
        const prm = axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GEO_KEY}`)
            .then(res => {
                if (res.data.results) {
                    const pos = res.data.results[0].geometry.location
                    addMarker(pos)
                    return pos
                }
            })
        return prm
    }
}

function copyUrl(){
    let linkToCopy = document.URL
    console.log('linkToCopy', linkToCopy)
    linkToCopy += `?lat=${posToUrl.lat}&lng=${posToUrl.lng}`
    console.log('posToUrl.lat', posToUrl.lat)
    const el = document.createElement('textarea');
    el.value = linkToCopy;
    el.setAttribute('readonly', linkToCopy);
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    return Promise.resolve()
}

function _convertToCelsius(kelvin) {
    const toSubtract = -273.17
    const chelsiusData = {
        temp: parseInt(kelvin.temp + toSubtract),
        feelsLike: parseInt(kelvin.feels_like + toSubtract),
        maxTemp: parseInt(kelvin.temp_max + toSubtract),
        minTemp: parseInt(kelvin.temp_min + toSubtract)
    }
    return chelsiusData
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyD5S-mgaAxZpb1hYwhw2kCWdzo5535ai4A'; //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script');
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    elGoogleApi.async = true;
    document.body.append(elGoogleApi);

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve;
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}

