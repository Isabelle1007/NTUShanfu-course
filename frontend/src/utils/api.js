export const api = {
    // hostname: 'http://18.182.163.170',
    hostname_be: 'http://localhost:4000',
    hostname_fe: 'http://localhost:5173',
    getAllHomes() {
        return fetch(`${this.hostname_be}/api/home/all`).then(response => response.json());
    },
    getAllTypes() {
        return fetch(`${this.hostname_be}/api/type/all`).then(response => response.json());
    },
    getAllCurricula() {
        return fetch(`${this.hostname_be}/api/curriculum/all`).then(response => response.json());
    },
    getCurriculaByHome(home){
        return fetch(`${this.hostname_be}/api/curriculum/home/${home}`).then(response => response.json());
    },
    getCurriculaByType(type){
        return fetch(`${this.hostname_be}/api/curriculum/type/${type}`).then(response => response.json());
    },
    getCurriculaBySemester(semester){
        return fetch(`${this.hostname_be}/api/curriculum/semester/${semester}`).then(response => response.json());
    },
    getCurriculaByKeyword(keyword){
        return fetch(`${this.hostname_be}/api/curriculum/search/${keyword}`).then(response => response.json());
    },

};