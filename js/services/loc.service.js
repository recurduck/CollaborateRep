import { storageService } from './localStorage.js'
import { utilsService } from './utils.service.js'

export const locService = {
    getLocs,
    saveCurrLoc,
    deleteLoc,
    goLoc
}

const STORAGE_KEY = 'locsDB'

let nextId = 3
const locs = storageService.loadFromStorage(STORAGE_KEY) || []
function goLoc(locId) {
    let loc = locs.find(loc => loc.id === locId)
    return Promise.resolve({'lat': loc.lat, 'lng': loc.lng})
}

function deleteLoc(locId) {
    let locIdx = locs.findIndex(loc => loc.id === locId)
    locs.splice(locIdx, 1)
    storageService.saveToStorage(STORAGE_KEY, locs);
    return Promise.resolve(locs)
}

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function saveCurrLoc(loc) {
    getNewLocName()
        .then(res => {
            const newLoc = {
                id: utilsService.makeId(),
                name: res,
                lat: loc[loc.length - 1].lat,
                lng: loc[loc.length - 1].lng,
                createdAt: Date.now()
            }
            locs.push(newLoc)
            storageService.saveToStorage(STORAGE_KEY, locs)
        })
        .catch(err => {
            Swal.fire(
                'We are sorry,',
                err,
                'error'
            )
        });
}

function getNewLocName() {
    const prm = new Promise((res, rej) => {
        const newName = prompt('How would you like to call this place?')
        if (newName) return res(newName)
        return rej('user aborted')
    })
    return prm
}


window.locs = locs
