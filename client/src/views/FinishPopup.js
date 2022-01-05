import React, { useRef, useEffect } from 'react';
import { useUpdateEffect } from '../customHooks/useUpdateEffect';
import { useForceUpdate } from '../customHooks/useForceUpdate';
import Button from 'react-bootstrap/Button';


const FinishPopup = (props) => {
    const forceUpdate = useForceUpdate();

    const mainTasksCompleted = useRef([]);
    const mainTasksIncomplete = useRef([]);
    const bonusTasksCompleted = useRef([]);

    const tasks = useRef(JSON.parse(localStorage.getItem('tasks')));

    const netPoints = useRef(0);

    const checkMark = useRef("https://res.cloudinary.com/dzxscynhz/image/upload/v1641169599/android-chrome-192x192_pbres0.png");
    const xMark = useRef("https://res.cloudinary.com/dzxscynhz/image/upload/v1641171942/red-x-mark-transparent-background-12_tmwtnf.png");
    const plusMark = useRef("https://res.cloudinary.com/dzxscynhz/image/upload/v1641256910/1921090_a8xrfj.png");

    // create independent copies of props pass in
    // so they aren't lost when the finish function is done
    useUpdateEffect(()=>{
        if(props.activeTasks.current.length<1){ return }

        // create list of incomplete non bonus tasks and subtract points
        let incomplete = [];
        for(let task of props.activeTasks.current){
            if(task.is_bonus===false && task.is_completed===false){
                incomplete.push(task);
                netPoints.current -= task.points;
            }
        }

        mainTasksCompleted.current = props.mainTasksCompleted.current;
        mainTasksIncomplete.current = incomplete;
        bonusTasksCompleted.current = props.bonusTasksCompleted.current;

        calulatePointsAdd();
    }, [props.finished.current]);


    const calulatePointsAdd=()=>{
        let points = 0;
        for(let task of mainTasksCompleted.current){
            points += task.points;
        }
        for(let task of bonusTasksCompleted.current){
            points += task.points * 2;
        }
        netPoints.current += points;
    }

    const styles = {
        popupPage:{
            position:"fixed",
            top:"0",
            left:"0",
            width:"100%",
            height:"100vh",
            color:"azure",
            display:"flex",
            justifyContent:"center",
            alignItems:"center",
            backgroundColor:"rgb(0, 0, 0, 0.2)"
        },
        popupBody:{
            position:"relative",
            padding:"20px",
            borderRadius:"15px",
            width:"80%",
            maxWidth:"640px",
            backgroundColor:"rgb(30, 30, 30)"
        },
        itemText:{
            // height:"2rem"
        },
        checkMarkImg:{
            height:"1.5rem"
        },
        xMarkImg:{
            height:"1.25rem"
        },
        plusMarkImg:{
            height:"1.25rem"
        },
        itemPoints:{
            float:"right",
            marginRight:"1rem"
        },
        okButton:{
            color:"azure",
            backgroundColor:"rgb(0, 38, 255)",
            borderWidth:"1px",
            borderColor:"black",
            margin:".5rem .9rem 0rem .9rem"
        }

    }
    return (props.finished.current) ?(
        <div style={styles.popupPage}>
            <div style={styles.popupBody}>
            <center><h3>Nice job.</h3></center>
            <div class="row">
                <ul class="col-md-4">
                    {mainTasksCompleted.current.map(task=>(
                        <li key={task.id} style={{listStyleType:"none"}}>
                            <p style={styles.itemText}>
                            <img src={checkMark.current} style={styles.checkMarkImg}/>
                            &nbsp;{task.name} <b style={styles.itemPoints}>+{task.points}</b>
                            </p>
                        </li>
                    ))}
                </ul>
                <ul class="col-md-4">
                    {mainTasksIncomplete.current.map(task=>(
                        <li key={task.id} style={{listStyleType:"none"}}>
                            <p style={styles.itemText}>
                            <img src={xMark.current} style={styles.xMarkImg}/>
                            &nbsp;{task.name} <b style={styles.itemPoints}>-{task.points}</b>
                            </p>                        
                        </li>
                    ))}
                </ul>
                <ul class="col-md-4">
                    {bonusTasksCompleted.current.map(task=>(
                        <li key={task.id} style={{listStyleType:"none"}}>
                            <p style={styles.itemText}>
                            <img src={plusMark.current} style={styles.plusMarkImg}/>
                            &nbsp;&nbsp;{task.name} <b style={styles.itemPoints}>+{task.points * 2}</b>
                            </p>                        
                        </li>
                    ))}
                </ul>

            </div>
            <center><p>You got {`${netPoints.current}`} points today.</p>
            <Button style={styles.okButton} variant="success" 
                                onClick={()=>{
                                    props.finished.current = false
                                    forceUpdate()
                                }}>
                                OK.
            </Button>
            </center>

            </div>
        </div>
    ) : "";
}

export default FinishPopup;
