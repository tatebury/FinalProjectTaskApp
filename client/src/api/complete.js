import axios from 'axios';

// tell the route what user completed what task, then refresh the task display
export const completeTask=(userID, taskID, bonus=false, after=()=>{})=>{
    if(bonus===false){
        axios.post(`http://127.0.0.1:5000/user/${userID}/tasks/${taskID}/complete`)
        .then(response=>{
            // console.log(response.data);
            after();
        })
        .catch(error=>{
            console.error("There was an error completing the task: "+error);
        })
    }
    else{
        axios.post(`http://127.0.0.1:5000/user/${userID}/tasks/${taskID}/complete?bonus=1`)
        .then(response=>{
            // console.log(response.data);
            after();
        })
        .catch(error=>{
            console.error("There was an error completing the task: "+error);
        })
    }
}

// give the route a user and task object, 
// then use the user points returned in whatever function is passed in
export const finishTasks=(userID, after=()=>{})=>{
    axios.post(`http://127.0.0.1:5000/user/${userID}/finish`)
    .then(response=>{
        after(response.data.total_points);
    })
    .catch(error=>{
        console.error("There was an error completing the task: "+error);
    })
}