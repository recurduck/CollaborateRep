

export const mapService = {
    initMap,
    addMarker,
    panTo,
    map: gMap,
    getMarkers,
    getGeocode
}


var gMarkers = [];

let currPos;

var gMap;

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap');
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
                addMarker(loc)
                    .then(res => {
                        currPos = res
                        gMarkers.push(res.map.center)
                    })
            })
        })
}

function addMarker(loc) {
    if(currPos) currPos.setMap(null)
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
    });
    panTo(loc.lat, loc.lng)
    return Promise.resolve(marker) 
}

function panTo(lat, lng) {
    var latLng = new google.maps.LatLng(lat, lng);
    gMap.panTo(latLng);
}

function getMarkers(){
    return Promise.resolve(gMarkers)
}

function getGeocode(ev){
    const address = ev.target.value
    if(address){
        const GEO_KEY = 'AIzaSyARh9KjQvI2E01yjvxzeozkaiNT3QflJFs'
        const prm = axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GEO_KEY}`)
        .then(res => {
            console.log('res.data.geometry.location', res.data.results)
            if(res.data.results){
                const pos = res.data.results[0].geometry.location
                console.log('pos', pos)
                addMarker(pos)
            }
                // const pos = res.data.geometry.location
                // addMarker(pos)
            })
    }
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


window.gMarkers = gMarkers