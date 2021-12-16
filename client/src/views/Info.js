import React from 'react';
import { infoStyles, homeStyles } from '../styles';

export default function Info() {
    return (
        <div style={infoStyles.pageStyle}>
            <h2>Task App guide</h2>
            <h5>How it works</h5>
            <ol>
                <li>
                    <a style={homeStyles.link} href={"/taskbuilder"}>Create your tasks </a>
                    or copy popular tasks made by other users (coming soon)
                </li>
                <li>
                    <a style={homeStyles.link} href={"/mytasks"}>Add the tasks you want </a>
                    to complete to your list for the day 
                    <br/>or use your task sets to 
                    add a group of tasks 
                    all at once (coming soon)
                </li>
                <li>
                    Hit the <a style={homeStyles.link} href={"/"}>Start </a>button
                </li>
                <li>
                    Check off each task once completed
                </li>
                <li>
                    Add bonus tasks if you want
                </li>
                <li>
                    Hit the Finish button
                </li>
            </ol>
            <h5>Helpful tips</h5>
            <ol>
                <li>
                    Bonus tasks are worth double points once you complete all other tasks.
                </li>
                <li>
                    Try completing your most important tasks first
                </li>
                <li>
                    Tasks are color-coded by importance
                </li>
            </ol>
            {/* <h5>Things to not do</h5>
            <ol>
                <li>
                    Try to avoid adding tasks of little significance together with high priority tasks.
                </li>
            </ol> */}
        </div>
    )
}
