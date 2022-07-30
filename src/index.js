import React, { useState, useRef, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';

import './styles.css'

import * as reducer from "./helper/reducer.js"
import * as check from './helper/check.js'
import * as calc from './helper/calc_set.js'

import { useWindowSize } from "./helper/hooks.js";

import MainGraph from './Components/Graph';
import PeriodeSelect from './Components/SelectPeriod';

import * as d3_transition from 'd3-transition';
import * as d3_ease from 'd3-ease';
import * as d3_array from 'd3-array';

import data_persons from "./data/persons.json";
import data_events from "./data/events.json";

const standardColor = "#141452";
const highlightColor = "magenta";
const margin = { top: 25, right: 40, bottom: 5, left: 30 };
const padding = 15;
const transitionDuration = 350;

const getTransition = () => {
    return d3_transition.transition().duration(transitionDuration).ease(d3_ease.easeLinear);
}

const Image = (highlight) => {
    if(highlight.ident === "events"){
    return(
        <div style ={{padding : 5}}>
            <img
                style = {{width : "100%"}}
                src = { require("./img/" + highlight.element.src_name + ".jpg")}
            />
        </div>
        )
    }
    else return null
}

function App (){

    const mainRef = useRef();
    const windowSize = useWindowSize();
    const [firstSet, setFirstSet] = useState(false)
    const [killSwitch, setKill] = useState(false)

    // state

    const [state, setState] = useState({ 

        width : null,
        mainRef : mainRef,
        maxScale : 10,
        dateOptions : { year: 'numeric', month: 'long' },
        transition : getTransition,
        sortTypes : ["Sequence", "Age", "Reign"],

        isTouch : check.touchDevice(),

        timeMargin : {
            normal : 100,
        },

        margin : margin,
        padding : padding,

        highlightColor : highlightColor,
        standardColor : standardColor,

        textOpacity : {
            active : 0.7, disabled: 0
        },

        handle : {
            size : 20,
            offset : 15,
            bottom : 30,
            opacity : 1, 
            color : standardColor,
            lineWidth : {
                normal : .2,
                highlight : 1.5
            },
        },

        lineWidth : 0.25,
        textOffset : 5,

        selections : null,
        zoomObject : null

    });

    // highlight

    const [highlight, setHIGHLIGHT] = useReducer(reducer.highlight, {
        highlight_main : false,
        ident : null,
        key : null,
        infos : null,
        element : null,
    })

    // FIRST DRAW:

    if(!firstSet && state.mainRef.current){

        const calc_events = data_events.map((event, i) => { 
            return {
                ...event, 
                order: i
            }}).sort((a,b) => { 
                return d3_array.descending(a.order, b.order) 
        });
        
        const calc_persons = data_persons.map((person, i) => { 
            return {
                ...person, 
                age: new Date(person.end).getFullYear() - new Date(person.start).getFullYear(),
                focus : person.focus_start !== null ? new Date(person.focus_end).getFullYear() - new Date(person.focus_start).getFullYear() : 0
            }
        })
        
        const data = {
            persons : calc_persons,
            events : calc_events,
        }

        const date = calc.dateBoundaries(data_persons)

        const sizeData = calc.size({
            ...state,
            data,
            startDate : new Date(date.start),
            stopDate : new Date(date.stop),
            })

        const newState = {
            ...state,
            ...sizeData,
            data : {
                ...data,
            }
        }

        setState(newState);
        setFirstSet(true)
    }

    useEffect(() => { 
        if(firstSet && state.selectionsSet && (state.mainRefSize !== mainRef.current.clientWidth)){ 
            const sizeData = calc.size(state)
            setState({
                ...state,
                ...sizeData,
            });

        }
    }, [
        firstSet,
        windowSize,
        state,
        mainRef
    ])

    //

    const mainProps = {
        firstSet : firstSet,
        state : state,
        setState : setState,
        highlight : highlight,
        setHIGHLIGHT : setHIGHLIGHT,
        killSwitch : killSwitch
    }

    if(firstSet){
        return(
            <div 
                ref = {mainRef} 
                style = {{flexWrap: "wrap", display: "flex", width: "100%" }} 
                >  
                <div style = {{ marginLeft: margin.left, textDecoration : "underline lightgrey"}} className = "Text" >
                    early roman emperors
                </div>
                <MainGraph {...mainProps} />
                <div style = {{backgroundColor: "magenta", color: "white", marginLeft: margin.left, display : highlight.highlight_main ? "block" : "none"}} className = "Text" >
                    {highlight.highlight_main ? "HIGHLIGHT: " + highlight.element.name : ""}
                    <button onClick = { () => { setKill(() =>  killSwitch ? false : true) }}>cancel</button>
                    <Image { ... highlight } />
                </div>
                <div style ={{width:"100%", marginLeft: margin.left, marginRight : margin.right}}>
                    {/* <PeriodeSelect state = { state }/> */}
                </div>

            </div>
        )
    }
    else{
        return(
            <div ref = { mainRef } >
                <div style = {{ overflow : "hidden", display: "flex" }}>
                    <span style = {{ display: "flex", alignItems: "center", justifyContent: "center", height: 500, width: "100%"}}>
                        loading
                    </span>
                </div>
            </div>
        )
    }
}

ReactDOM.render( <App/>, document.getElementById('root') );

