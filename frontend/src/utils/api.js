export const api = {
    // hostname: 'http://18.182.163.170',
    hostname: 'http://localhost:4000',
    getAllHomes() {
        return fetch(`${this.hostname}/home/all`).then(response => response.json());
    },
    
    getAllTypes() {
        return fetch(`${this.hostname}/type/all`).then(response => response.json());
    },
};