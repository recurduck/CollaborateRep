import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

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
            <td><button class="btn-go" data-id="${location.id}"><img src="./img/icons/go.png" alt="go"></button></td>
            <td><button class="btn-del"data-id="${location.id}"><img src="./img/icons/trash.svg" alt="Del"></button></td>        
        </tr>
        `});
    document.querySelector('.table tbody').innerHTML = strHtml.join('');
}

function addEventListenrs() {
    document.querySelector('.btn-pan').addEventListener('click', (ev) => {
        console.log('Panning the Map');
        mapService.panTo(35.6895, 139.6917);
    })
    document.querySelector('.btn-get-locs').addEventListener('click', (ev) => {
        locService.getLocs()
            .then(locs => {
                console.log('Locations:', locs)
                document.querySelector('.locs').innerText = JSON.stringify(locs)
            })

    })
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
                locService.saveCurrLoc(res[res.length - 1])
            })
            .catch(err => {
                Swal.fire(
                    'We are sorry,',
                    err,
                    'error'
                )
            })
    })
}


// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos');
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

