export const api = {
    //production
    server_url: 'https://ntushanfu-search-curricula.onrender.com', 
    app_url: 'https://ntushanfu.onrender.com', 
    //development
    // server_url: 'http://localhost:4000', 
    // app_url: 'http://localhost:3000', 

    getAllHomes() {
        return fetch(`${this.server_url}/home/all`).then(response => response.json());
    },
    getAllTypes() {
        return fetch(`${this.server_url}/type/all`).then(response => response.json());
    },
    getAllCurricula() {
        return fetch(`${this.server_url}/curriculum/all`).then(response => response.json());
    },
    getCurriculaByHome(home){
        return fetch(`${this.server_url}/curriculum/home/${home}`).then(response => response.json());
    },
    getCurriculaByType(type){
        return fetch(`${this.server_url}/curriculum/type/${type}`).then(response => response.json());
    },
    getCurriculaBySemester(semester){
        return fetch(`${this.server_url}/curriculum/semester/${semester}`).then(response => response.json());
    },
    getCurriculaByKeyword(keyword){
        return fetch(`${this.server_url}/curriculum/search/${keyword}`).then(response => response.json());
    },
    getCurriculumByID(id){
        return fetch(`${this.server_url}/curriculum/id/${id}`).then(response => response.json());
    },
    getCurriculumByUserID(id){
        return fetch(`${this.server_url}/curriculum/user/${id}`).then(response => response.json());
    },
    getAllUsers(){
        return fetch(`${this.server_url}/user/all`).then(response => response.json());
    },
    postFile(formdata, type){
        if(type === 'w'){
            return fetch(`${this.server_url}/file/upload/type/word`, {
                body: formdata,
                method: 'POST',
              }).then(response => response.json());
        }else{
            return fetch(`${this.server_url}/file/upload/type/pdf`, {
                body: formdata,
                method: 'POST',
              }).then(response => response.json());
        }
    },
    postCurriculum(data){
        return fetch(`${this.server_url}/curriculum/upload`, {
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
            method: 'POST',
          }).then(response => response.json());
    },
    // insertContent(cid){
    //     return fetch(`${this.server_url}/curriculum/fileContent/id/${cid}`).then(response => response.json());
    // },
    signUp(data){
        return fetch(`${this.server_url}/user/signup`, {
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
            method: 'POST',
          }).then(response => response.json());
    },
    login(data){
        return fetch(`${this.server_url}/user/login`, {
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
            }),
            method: 'POST',
          }).then(response => response.json());
    },
    getUserInfo(access_token){
        return fetch(`${this.server_url}/user/profile`,{
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`,
            }),
        }).then(response => response.json());
    },
    putCurriculum(access_token, id, data){
        return fetch(`${this.server_url}/curriculum/update/id/${id}`,{
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`,
            }),
            body: JSON.stringify(data),
            method: 'PUT',
        }).then(response => response.json());
    },
    putUserProfile(access_token, data){
        return fetch(`${this.server_url}/user/edit`,{
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`,
            }),
            body: JSON.stringify(data),
            method: 'PUT',
        }).then(response => response.json());
    },
    deleteCurriculum(access_token, id){
        return fetch(`${this.server_url}/curriculum/delete/id/${id}`,{
            headers: new Headers({
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`,
            }),
            method: 'DELETE',
        }).then(response => response.json());
    },

};