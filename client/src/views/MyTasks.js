import React, {useState, useEffect, useContext, useRef} from 'react';
import { Navigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { getIsStarted } from '../api/started';
import { deleteTask } from '../api/task';
import { useUpdateEffect } from '../customHooks/useUpdateEffect';
import { useForceUpdate } from '../customHooks/useForceUpdate';
import { setActive, setBonusActive } from '../api/active';
import { setUserEdit } from '../api/user';
import {TaskContext} from '../App';
import { taskPageStyles, homeStyles } from '../styles';
import { miscStyles } from '../styles';



function MyTasks(props) {
    const forceUpdate = useForceUpdate();
    const [redirect, setRedirect] = useState(()=>false);
    const tasks = useContext(TaskContext);
    const tempTasks = useRef(JSON.parse(localStorage.getItem('tasks')));
    const [userID, setUserID] = useState(()=>parseInt(localStorage.getItem('currentUserID')));

    useEffect(()=>getIsStarted(userID, (responseBool)=>props.setStarted(responseBool)), []);
    useUpdateEffect(()=>{
        setUserID(parseInt(localStorage.getItem('currentUserID')));
    }, [userID])

    // deal with temporary task list (make a copy of tasks list on page load)
    useEffect(()=>{
        tempTasks.current = JSON.parse(localStorage.getItem('tasks'));
    }, [tempTasks])
    useEffect(()=>{
        if(props.fromEdit){
            props.getUserTasks((response)=>{
                tempTasks.current = response;
                forceUpdate();
            });
        }
    }, [])

    const setTempTaskActive=async (taskID, active, bonus, index)=>{
        let tasks = tempTasks.current
        let task = tasks[index]
        if(task!==undefined){
            task.is_active = active;
            task.is_bonus = bonus;
        }else{
            console.error("task was not found");
        }
        localStorage.setItem('tasks', JSON.stringify(tasks));
        tempTasks.current = tasks;
        forceUpdate();
    }

    const handleUse=(id, index)=>{
        setTempTaskActive(id, true, false, index)
        setActive(id, true, ()=>{});
    }
    const handleRemove=(id, index)=>{
        setTempTaskActive(id, false, false, index)
        setActive(id, false, ()=>{});
    }

    const handleAddBonusTask=(id, index)=>{
        setTempTaskActive(id, true, true, index)
        setBonusActive(id, true, ()=>{});
    }
    const handleRemoveBonusTask=(id, index)=>{
        setTempTaskActive(id, false, true, index)
        setBonusActive(id, false, ()=>{});
    }
    
    const handleEdit=(taskID)=>{
        setUserEdit(userID, taskID, ()=>{
            setRedirect(true);
            props.fromEdit.current = true;
        });
    }

    const handleDelete=(taskID, index)=>{
        let tasks = tempTasks.current
        if(index!==null && index!==undefined){
            tasks.splice(index, 1);
        }else{
            console.error("task was not found");
        }
        localStorage.setItem('tasks', JSON.stringify(tasks));
        tempTasks.current = tasks;
        deleteTask(taskID, ()=>{});
        forceUpdate();
    }
    

    return (
        <>
        <div style={taskPageStyles.pageStyle}>
        {redirect ? <Navigate to={{pathname:"/edittask", props:{getUserTasks:props.getUserTasks}}}/> :''}

            {tempTasks.current?.length>0 ? 
            <>
            <a style={taskPageStyles.link} href={"/"}>Back to Homepage</a><br/>
            <ul>
                {tempTasks.current.map(task=>(
                    <li key={task.id} style={{...taskPageStyles.listItem, "backgroundColor":task.color}}>
                        
                        
                        <div style={taskPageStyles.name}>
                            <h5 style={miscStyles.blackOutline}>
                                {task.name}
                            </h5>
                            <b>
                                {parseInt(task.time/60)} min
                            </b>
                            <br/>
                        </div>
                        <h4 style={taskPageStyles.importance}>
                            <b>
                            {task.importance}
                            </b>
                        </h4>

                        <p style={taskPageStyles.description}>
                            {task.description}
                        </p>
                        <p style={taskPageStyles.steps}>
                            {task.steps}
                        </p>
                        
                        <br/><br/><br/><br/>
                        
                        {props.started==true ?
                        <>
                            {task.is_active ?
                            <>
                                {task.is_bonus ?
                                <Button style={taskPageStyles.removeBonusButton} variant="danger" 
                                    onClick={()=>handleRemoveBonusTask(task.id, tempTasks.current.indexOf(task))}>
                                    Remove Bonus Task
                                </Button>
                                :
                                <Button style={{borderWidth:"1px", borderColor:"black"}} variant="secondary" type="disabled">
                                    In Use
                                </Button>
                                }
                            </>
                            :
                            <Button style={taskPageStyles.useBonusButton} variant="success" 
                                onClick={()=>handleAddBonusTask(task.id, tempTasks.current.indexOf(task))}>
                                Add Bonus Task
                            </Button>
                            }
                        </>
                        :
                        <>                        
                            {task.is_active ?
                            <Button style={taskPageStyles.removeButton} variant="danger" 
                                onClick={()=>handleRemove(task.id, tempTasks.current.indexOf(task))}>
                                Remove
                            </Button>
                            :
                            <Button style={taskPageStyles.useButton} variant="success" 
                                onClick={()=>handleUse(task.id, tempTasks.current.indexOf(task))}>
                                Use Task
                            </Button>
                            }
                        </>
                        }   
                        <Button style={taskPageStyles.editButton} variant="warning" 
                            onClick={()=>handleEdit(task.id)}>
                            Edit
                        </Button>
                        <Button style={taskPageStyles.deleteButton} variant="danger" 
                            onClick={()=>handleDelete(task.id, tempTasks.current.indexOf(task))}>
                            Delete
                        </Button>

                        <br/>
                        
                    </li>
                ))}
            </ul>
            </>
            :
            <p >
                It looks like you have no tasks. You can create some with the
                &nbsp;<a style={homeStyles.link} href={"/taskbuilder"}>Task Builder</a>.
            </p>
            
            }
        </div>
        </>
    );
}

export default MyTasks;
