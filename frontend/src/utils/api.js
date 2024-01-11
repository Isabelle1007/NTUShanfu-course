export const api = {
    app_url: import.meta.env.VITE_APP_URL,
    server_url: import.meta.env.VITE_SERVER_URL,
    getAllHomes() {
        return fetch(`${this.hostname_be}/home/all`).then(response => response.json());
    },
    getAllTypes() {
        return fetch(`${this.hostname_be}/type/all`).then(response => response.json());
    },
    getAllCurricula() {
        return fetch(`${this.hostname_be}/curriculum/all`).then(response => response.json());
    },
    getCurriculaByHome(home){
        return fetch(`${this.hostname_be}/curriculum/home/${home}`).then(response => response.json());
    },
    getCurriculaByType(type){
        return fetch(`${this.hostname_be}/curriculum/type/${type}`).then(response => response.json());
    },
    getCurriculaBySemester(semester){
        return fetch(`${this.hostname_be}/curriculum/semester/${semester}`).then(response => response.json());
    },
    getCurriculaByKeyword(keyword){
        return fetch(`${this.hostname_be}/curriculum/search/${keyword}`).then(response => response.json());
    },
    getCurriculumByID(id){
        return fetch(`${this.hostname_be}/curriculum/id/${id}`).then(response => response.json());
    },
    getAllUsers(){
        return fetch(`${this.hostname_be}/user/all`).then(response => response.json());
    },
    postFile(formdata, type){
        if(type === 'w'){
            return fetch(`${this.hostname_be}/file/upload/type/word`, {
                body: formdata,
                method: 'POST',
              }).then(response => response.json());
        }else{
            return fetch(`${this.hostname_be}/file/upload/type/pdf`, {
                body: formdata,
                method: 'POST',
              }).then(response => response.json());
        }
    },
    postCurriculum(data){
        return fetch(`${this.hostname_be}/curriculum/upload`, {
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
            method: 'POST',
          }).then(response => response.json());
    },
    insertContent(cid){
        return fetch(`${this.hostname_be}/curriculum/fileContent/id/${cid}`).then(response => response.json());
    },
    signUp(data){
        return fetch(`${this.hostname_be}/user/signup`, {
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
            method: 'POST',
          }).then(response => response.json());
    },
    login(data){
        return fetch(`${this.hostname_be}/user/login`, {
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
            method: 'POST',
          }).then(response => response.json());
    },
    getUserInfo(access_token){
        return fetch(`${this.hostname_be}/user/profile`,{
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`,
            }),
        }).then(response => response.json());
    },
    putCurriculum(access_token, id, data){
        return fetch(`${this.hostname_be}/curriculum/update/id/${id}`,{
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`,
            }),
            body: JSON.stringify(data),
            method: 'PUT',
        }).then(response => response.json());
    },
    putUserProfile(access_token, data){
        return fetch(`${this.hostname_be}/user/edit`,{
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`,
            }),
            body: JSON.stringify(data),
            method: 'PUT',
        }).then(response => response.json());
    },
    deleteCurriculum(access_token, id){
        return fetch(`${this.hostname_be}/curriculum/delete/id/${id}`,{
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`,
            }),
            method: 'DELETE',
        }).then(response => response.json());
    },

};