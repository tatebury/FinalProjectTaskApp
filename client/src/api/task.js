import axios from 'axios';

export const getTask=(taskID, after=()=>{})=>{
    axios.get(`http://127.0.0.1:5000/tasks/${taskID}`)
    .then(response=>{
        // console.log(response.data);
        after(response.data);
    })
    .catch(error=>{
        console.error("There was an error getting the task: "+error);
    })
}

export const deleteTask=(taskID, after=()=>{})=>{
    axios.delete(`http://127.0.0.1:5000/tasks/${taskID}`)
    .then(response=>{
        console.log(response.data);
        after();
    })
    .catch(error=>{
        console.error("There was an error getting the task: "+error);
    })
}