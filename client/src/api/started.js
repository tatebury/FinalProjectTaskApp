import axios from 'axios';

//// user start tasks functions //// 

// get user's is_started value
export const getIsStarted=(userID, after=()=>{})=>{
    if (userID==0){return;}
    axios.get(`https://idimtaskapp.herokuapp.com/user/${userID}/isstarted`)
    .then(response=>after(response.data.is_started))
    .catch(error=>{
        console.error("There was an error checking the started value: "+error);
    })
}

// set user's is_started value
export const setIsStarted=(started=true, userID, after=()=>{})=>{
    axios.put(`https://idimtaskapp.herokuapp.com/user/${userID}/start?started=${started}`)
    .then(response=>{
        after();
    })
    .catch(error=>{
        console.error("There was an error setting the started value: "+error);
    })
}
