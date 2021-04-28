
import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { utilsService } from './services/utils.service.js';

window.onload = onInit;

function onInit() {
    addEventListenrs();
    mapService.initMap()
        .then(() => {
            console.log('Map is ready');
        })
        .catch(() => console.log('Error: cannot init map'))
    locService.getLocs()
        .then((res) => renderTableContent(res))
        .then(() => {
            getPosition()
                .then(pos => {
                    mapService.addMarker({ lat: pos.coords.latitude, lng: pos.coords.longitude })
                })
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    console.log('err!!!', err);
                })
        })
        .catch(() => console.log('Error: cannot get locations'))

}

function renderTableContent(res) {
    let strHtml = res.map(location => {
        return `<tr>
            <td>${location.id}</td>
            <td>${location.name}</td>
            <td>${location.createdAt}</td>
            <td><button class="btn-go" data-id="${location.id}">Go</button></td>
            <td><button class="btn-del" data-id="${location.id}">Del</button></td>        
        </tr>
        `});
    document.querySelector('.table tbody').innerHTML = strHtml.join('');
    addEventListenrsTable();
}

function renderWeather(locData) {
    const strHtml = `<div class="curr-temp">Current temp: ${locData.temp}</div>
                     <div class="feels-like">Feels like: ${locData.feelsLike}</div>
                     <div class="max-temp">Max temp: ${locData.maxTemp}</div>
                     <div class="min-temp">Min temp: ${locData.minTemp}</div>`
    document.querySelector('.weather-container').innerHTML = strHtml
}

function addEventListenrs() {
    document.querySelector('.btn-user-pos').addEventListener('click', (ev) => {
        getPosition()
            .then(pos => {
                mapService.addMarker({ lat: pos.coords.latitude, lng: pos.coords.longitude })
            })
            .catch(err => {
                console.log('err!!!', err);
            })
    })
    document.querySelector('.btn-add-marker').addEventListener('click', () => {
        mapService.getMarkers()
            .then(res => {
                locService.saveCurrLoc(res)
            })
            .then(() => locService.getLocs())
            .then(res => renderTableContent(res))
            .catch(err => {
                Swal.fire(
                    'We are sorry,',
                    err,
                    'error'
                )
            })
    })
    document.querySelector('.search-form').addEventListener('submit', ev => {
        ev.preventDefault()
        const elForm = ev.target
        const inputVal = elForm.querySelector('input').value
        mapService.getGeocode(inputVal)
            .then(res => {
                return mapService.getWeather(res.lat, res.lng)
            })
            .then(res => {
                renderWeather(res);
            })
    })
    document.querySelector('.btn-copy-url').addEventListener('click', (ev) => {
        mapService.copyUrl()
            .then(() => {
                Swal.fire(
                    'Success!',
                    'Link copied to clipboard',
                    'success'
                )
            })
    })
}

function addEventListenrsTable() {
    document.querySelector('.table .btn-del').addEventListener('click', (ev) => {
        locService.deleteLoc(ev.target.dataset.id)
            .then(res => renderTableContent(res))
            .catch((err) => Swal.fire('Connot Delete Location'))
    })
    document.querySelector('.table .btn-go').addEventListener('click', (ev) => {
        locService.goLoc(ev.target.dataset.id)
            .then(res => {
                return mapService.addMarker(res)
            })
            .then((res) => {
                const loc = {
                    lat: res.position.lat(),
                    lng: res.position.lng()
                }
                return mapService.getWeather(loc.lat, loc.lng)
            })
            .then(res => {
                renderWeather(res)
            })
            .catch((err) => Swal.fire('Connot Delete Location'))
    })
}


// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting curr Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

