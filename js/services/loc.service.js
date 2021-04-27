export const locService = {
    getLocs,
    saveCurrLoc
}

let nextId = 3
const locs = [
    {id:1, name: 'Loc1', lat: 32.047104, lng: 34.832384 }, 
    {id:2, name: 'Loc2', lat: 32.047201, lng: 34.832581 }
]

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(locs);
        }, 2000)
    });
}

function  saveCurrLoc(loc) {
    getNewLocName()
        .then(res => {
            const newLoc = {
                id: nextId++,
                name: res,
                lat: loc.lat(),
                lng: loc.lng
            }
            locs.push(newLoc)
        })
}

function getNewLocName() {
    const prm = new Promise((res, rej) => {
        const newName = prompt('How would you like to call this place?')
        if(newName) return res(newName)
        return rej('user aborted')
    })
    return prm
}



