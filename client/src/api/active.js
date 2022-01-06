import axios from 'axios';

//// task activation functions ////

export const setActive=(taskID, active=true, after=()=>{})=>{

    axios.put(`https://idimtaskapp.herokuapp.com/tasks/${taskID}/setactive?active=${active}`)
    .then(response=>{
        after();
    })
    .catch(error=>{console.error("There was an error setting the task active: "+error)})
}

export const setBonusActive=(taskID, active=true, after=()=>{})=>{

    axios.put(`https://idimtaskapp.herokuapp.com/tasks/${taskID}/setactive?active=${active}&bonus=1`)
    .then(response=>{
        after();
    })
    .catch(error=>{console.error("There was an error setting the bonus task active: "+error)})
}

export const deactivateAll=(userID, after=()=>{})=>{
    axios.put(`https://idimtaskapp.herokuapp.com/user/${userID}/tasks/deactivateall`)
    .then(response=>{
        console.log(response.data);
        after();
    })
    .catch(error=>{console.error("There was an error deactivating the tasks: "+error)})
}