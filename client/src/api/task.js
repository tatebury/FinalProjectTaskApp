import axios from 'axios';

export const getTask=(taskID, after=()=>{})=>{
    axios.get(`https://idimtaskapp.herokuapp.com/tasks/${taskID}`)
    .then(response=>{
        // console.log(response.data);
        after(response.data);
    })
    .catch(error=>{
        console.error("There was an error getting the task: "+error);
    })
}

export const deleteTask=(taskID, after=()=>{})=>{
    axios.delete(`https://idimtaskapp.herokuapp.com/tasks/${taskID}`)
    .then(response=>{
        console.log(response.data);
        after();
    })
    .catch(error=>{
        console.error("There was an error getting the task: "+error);
    })
}

export const getCompletedTasks=(userID, after=()=>{})=>{
    axios.get(`https://idimtaskapp.herokuapp.com/user/${userID}/completedtasks`)
    .then(response=>{
        after(response.data);
    })
    .catch(error=>{
        console.error("There was an error getting completed tasks: "+error);
    })
}