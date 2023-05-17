export const api = {
    // hostname: 'http://18.182.163.170',
    hostname_be: 'http://localhost:4000',
    hostname_fe: 'http://localhost:5173',
    getAllHomes() {
        return fetch(`${this.hostname_be}/home/all`).then(response => response.json());
    },
    getAllTypes() {
        return fetch(`${this.hostname_be}/type/all`).then(response => response.json());
    },
};