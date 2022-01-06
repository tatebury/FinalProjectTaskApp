import axios from 'axios';

export const getUser=(userID, after=()=>{})=>{
    axios.get(`https://idimtaskapp.herokuapp.com/user/${userID}`)
    .then(response=>{
        // console.log(response.data);
        after(response.data);
    })
    .catch(error=>{
        console.error("There was an error getting the user: "+error);
    })
}

export const setUserEdit=(userID, editID, after=()=>{})=>{
    axios.post(`https://idimtaskapp.herokuapp.com/user/${userID}/edittask/${editID}`)
    .then(response=>{
        // console.log(response.data);
        after();
    })
    .catch(error=>{
        console.error("There was an error getting the user: "+error);
    })
}