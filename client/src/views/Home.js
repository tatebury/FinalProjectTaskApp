import React, { useState, useEffect, useContext, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import { deactivateAll } from '../api/active';
import { getIsStarted, setIsStarted } from '../api/started';
import { completeTask, finishTasks } from '../api/complete';
import { useForceUpdate } from '../customHooks/useForceUpdate';
import { useUpdateEffect } from '../customHooks/useUpdateEffect';
import { getCompletedTasks } from '../api/task'
import { TaskContext } from '../App';
import { taskPageStyles } from '../styles';
import { homeStyles } from '../styles';
import FinishPopup from './FinishPopup';
import { miscStyles } from '../styles';


const Home = (props) => {
    const checkMark = useRef("https://res.cloudinary.com/dzxscynhz/image/upload/v1641169599/android-chrome-192x192_pbres0.png");
    const plusMark = useRef("https://res.cloudinary.com/dzxscynhz/image/upload/v1641256910/1921090_a8xrfj.png");

    const tasks = useContext(TaskContext);
    const forceUpdate = useForceUpdate();

    const activeTasks = useRef([]);
    const mainTasksCompleted = useRef([]);
    const bonusTasksCompleted = useRef([]);
    const primaryTasks = useRef([]);
    const finished = useRef(false);
    const primaryTasksComplete = useRef(false);
    const [userID, setUserID] = useState(()=>parseInt(localStorage.getItem('currentUserID')));

    useEffect(()=>{
        getIsStarted(userID, (responseBool)=>props.setStarted(responseBool))
        getCompletedTasks(userID, (responseObj)=>{
            mainTasksCompleted.current = responseObj.main_tasks;
            bonusTasksCompleted.current = responseObj.bonus_tasks;
        })
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
        activeTasks.current = active;
        primaryTasks.current = primary;
        primaryTasksComplete.current = complete;
        forceUpdate();
        
        return(()=>{
            
        })
    }, [tasks]);

    useUpdateEffect(()=>{
        setUserID(parseInt(localStorage.getItem('currentUserID')));
    }, [userID])

    //check if all non bonus tasks in activeTasks are complete then setPrimaryTasksComplete
    const checkPrimaryTasks=()=>{
        let complete = true;
        for(let task of primaryTasks.current){
            if (task.is_completed==false){
                complete = false;
                break;
            }
        }
        primaryTasksComplete.current = complete;
        forceUpdate();
    }

    const setActiveTaskComplete=(complete, bonus, index)=>{
        let tasks = activeTasks.current
        let task = tasks[index]
        if(task!==undefined){
            task.is_completed = complete;
            if(complete){
                if(bonus){
                    if(primaryTasksComplete){
                        task.is_counted_as_bonus = true;
                    }
                    bonusTasksCompleted.current = [...bonusTasksCompleted.current, task];
                }else{
                    mainTasksCompleted.current = [...mainTasksCompleted.current, task];
                }
            }
        }else{
            console.error("task was not found");
        }
        activeTasks.current = tasks;
        forceUpdate();
    }



    //use api call to turn off all tasks, refresh this task list when done
    const handleRemoveAll=()=>deactivateAll(userID, ()=>props.getUserTasks());

    // give api call a userID to start, and a function to call when done
    const handleStart=()=>setIsStarted(true, userID, ()=>props.setStarted(true));
    const handleFinish=()=>{
        finished.current = true;
        setIsStarted(false, userID, ()=>props.setStarted(false));
        finishTasks(userID, (responsePoints)=>{
            localStorage.setItem('totalPoints', responsePoints);
            props.getUserTasks();
        });
    }

    const handleCompletedTask=(taskID, index)=>{
        setActiveTaskComplete(true, false, index);
        completeTask(userID, taskID, false, ()=>{
            checkPrimaryTasks();
        });
    }
    const handleCompletedBonusTask=(taskID, index)=>{
        setActiveTaskComplete(true, primaryTasksComplete, index);
        completeTask(userID, taskID, primaryTasksComplete, ()=>{});
    }


    const styles = {
        checkMarkImg:{
            height:"2.5rem"
        },
        plusMarkImg:{
            height:"1.25rem"
        },
        taskName:{
            fontSize:"20px"
        }
    }
    
    return (
        <>
        <div style={taskPageStyles.pageStyle}>

            {activeTasks.current.length>0 ? 
            <>
            <a style={taskPageStyles.link} href={"/mytasks"}>Add more tasks</a><br/>
            {props.started==true ?
            <>
            <Button style={taskPageStyles.finishButton} variant="success" 
                onClick={handleFinish}>
                    Finish
            </Button>
            </>
            :
            <>
            <Button style={taskPageStyles.startButton} variant="info" 
                onClick={handleStart}>
                Start
            </Button>
            <Button style={taskPageStyles.removeAllButton} variant="danger" 
                onClick={handleRemoveAll}>
                Remove All
            </Button>
            </>
            }
            <div>
            <ul>
                {activeTasks.current.map(task=>(
                    <li key={task.id} style={{...taskPageStyles.listItem, "backgroundColor":task.color}}>
                                    
                                    
                                <div style={taskPageStyles.name}>
                                    <b style={{...styles.taskName, ...miscStyles.blackOutline}}>{task.name}</b><br/>
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
                                        {task.is_counted_as_bonus==false ?
                                            <img src={checkMark.current} style={styles.checkMarkImg} />
                                        :
                                        <>
                                        <img src={plusMark.current} style={styles.plusMarkImg} />
                                        &nbsp;
                                        <img src={checkMark.current} style={styles.checkMarkImg} />
                                        </>
                                        }
                                    </>
                                    :
                                    <>
                                        {task.is_bonus==false ?
                                        <Button  style={taskPageStyles.useButton} variant="primary" 
                                            onClick={()=>handleCompletedTask(task.id, activeTasks.current.indexOf(task))}>
                                            I'm Done
                                        </Button>
                                        :
                                        <Button variant="success" 
                                            onClick={()=>handleCompletedBonusTask(task.id, activeTasks.current.indexOf(task))}>
                                            Bonus Done
                                        </Button>
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
        <FinishPopup 
        finished={finished}
        activeTasks={activeTasks}
        mainTasksCompleted={mainTasksCompleted}
        bonusTasksCompleted={bonusTasksCompleted}
        ></FinishPopup>
        </>
    );
}

export default Home;
