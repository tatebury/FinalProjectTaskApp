import axios from 'axios';

//// user start tasks functions //// 

// get user's is_started value
export const getIsStarted=(userID, after=()=>{})=>{
    if (userID==0){return;}
    axios.get(`http://127.0.0.1:5000/user/${userID}/isstarted`)
    .then(response=>after(response.data.is_started))
    .catch(error=>{
        console.error("There was an error checking the started value: "+error);
    })
}

// set user's is_started value
export const setIsStarted=(started=true, userID, after=()=>{})=>{
    axios.put(`http://127.0.0.1:5000/user/${userID}/start?started=${started}`)
    .then(response=>{
        after();
    })
    .catch(error=>{
        console.error("There was an error setting the started value: "+error);
    })
}
