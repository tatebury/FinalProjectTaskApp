import React, { useState, useEffect, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import { deactivateAll } from '../api/active';
import { getIsStarted, setIsStarted } from '../api/started';
import { completeTask, finishTasks } from '../api/complete';
import { useUpdateEffect } from '../customHooks/useUpdateEffect';
import { TaskContext } from '../App';
import { taskPageStyles } from '../styles';
import { homeStyles } from '../styles';


const Home = (props) => {
    const tasks = useContext(TaskContext);

    const [activeTasks, setActiveTasks] = useState(()=>[]);
    const [primaryTasks, setPrimaryTasks] = useState(()=>[]);
    const [primaryTasksComplete, setPrimaryTasksComplete] = useState(()=>false);
    const [userID, setUserID] = useState(()=>parseInt(localStorage.getItem('currentUserID')));

    useEffect(()=>{
        getIsStarted(userID, (responseBool)=>props.setStarted(responseBool))
    }, []);
    
    useEffect(()=>{
        if(tasks===null){
            return;
        }
        let active = [];
        let primary = [];
        let complete = true;
        for(let task of tasks){
            if (task.is_active){
                active.push(task);
                if(task.is_bonus==false){
                    primary.push(task);
                    if (task.is_completed==false){
                        complete = false;
                    }
                }
            }
        }
        setActiveTasks(active);
        setPrimaryTasks(primary);
        setPrimaryTasksComplete(complete);
    }, [tasks]);

    useUpdateEffect(()=>{
        setUserID(parseInt(localStorage.getItem('currentUserID')));
    }, [userID])

    //check if all non bonus tasks in activeTasks are complete then setPrimaryTasksComplete
    const checkPrimaryTasks=()=>{
        let complete = true;
        for(let task of primaryTasks){
            if (task.is_completed==false){
                complete = false;
                break;
            }
        }
        setPrimaryTasksComplete(complete);
    }

    //use api call to turn off all tasks, refresh this task list when done
    const handleRemoveAll=()=>deactivateAll(userID, ()=>props.getUserTasks());

    // give api call a userID to start, and a function to call when done
    const handleStart=()=>setIsStarted(true, userID, ()=>props.setStarted(true));
    const handleFinish=()=>{
        setIsStarted(false, userID, ()=>props.setStarted(false));
        finishTasks(userID, (responsePoints)=>{
            localStorage.setItem('totalPoints', responsePoints);
            props.getUserTasks();
        });
    }

    const handleCompletedTask=(taskID)=>{
        completeTask(userID, taskID, false, ()=>{
            checkPrimaryTasks();
            props.getUserTasks();
        });
    }
    const handleCompletedBonusTask=(taskID)=>{
        completeTask(userID, taskID, primaryTasksComplete, ()=>{
            props.getUserTasks();
        });
    }

    return (
        <div style={taskPageStyles.pageStyle}>

            {activeTasks.length>0 ? 
            <>
            <a style={taskPageStyles.link} href={"/mytasks"}>Add more tasks</a><br/>
            {props.started==true ?
            <>
            <Button style={taskPageStyles.finishButton} variant="success" onClick={handleFinish}>Finish</Button>
            </>
            :
            <>
            <Button style={taskPageStyles.startButton} variant="info" onClick={handleStart}>Start</Button>
            <Button style={taskPageStyles.removeAllButton} variant="danger" onClick={handleRemoveAll}>Remove All</Button>
            </>
            }
            <div>
            <ul>
                {activeTasks.map(task=>(
                            <li key={task.id} style={{...taskPageStyles.listItem, "backgroundColor":task.color}}>
                                    
                                    
                                <div style={taskPageStyles.name}>
                                    <h5>{task.name}</h5>
                                    <b>{parseInt(task.time/60)} min</b><br/>
                                </div>
                                <h4 style={taskPageStyles.importance}><b>{task.importance}</b></h4>

                                <p style={taskPageStyles.description}>{task.description}</p>
                                <p style={taskPageStyles.steps}>{task.steps}</p>
                                
                                <br/><br/><br/><br/>
                                {props.started==true ?
                                <>
                                    {task.is_completed==true ?
                                    <>
                                        {task.is_bonus==false ?
                                        <Button variant="success">Completed</Button>
                                        :
                                        <Button variant="success">Completed Bonus</Button>
                                        }
                                    </>
                                    :
                                    <>
                                        {task.is_bonus==false ?
                                        <Button  style={taskPageStyles.useButton} variant="primary" onClick={()=>handleCompletedTask(task.id)}>I'm Done</Button>
                                        :
                                        <Button variant="success" onClick={()=>handleCompletedBonusTask(task.id)}>Bonus Done</Button>
                                        }
                                    </>
                                    }
                                </>
                                :
                                <button style={{"backgroundColor":"transparent", "border":"none"}} type="disabled"></button>
                                }
                                <br/>
                            </li>
                        )
                    )
                }
            </ul>
            </div>
            </>
            :
            <p>
            No tasks. You can add some from
            &nbsp;<a style={homeStyles.link} href={"/mytasks"}>My Tasks</a>, 
            or create new ones with the
            &nbsp;<a style={homeStyles.link} href={"/taskbuilder"}>Task Builder</a>.
            </p>
            }
        </div>
    );
}

export default Home;
