import React, { useState, useRef, useEffect, useReducer } from 'react';
import ReactDOM from 'react-dom';

import * as reducer from "./helper/reducer.js"
import * as check from './helper/check.js'
import * as calc from './helper/calc_set.js'
import * as handleEvents from  './helper/events/events.js';

import { useWindowSize } from "./helper/hooks.js";

import Checkboxes from './Components/Checkboxes';
import MainGraph from './Components/Graph';
import Filter from './Components/Filter';

import * as d3_transition from 'd3-transition';
import * as d3_ease from 'd3-ease';

import data_wahlen from "./data/wahlen.json";
import data_infos from "./data/infos.json";
import data_perioden from "./data/perioden.json";

const stroemungen = [
    "konservativ", "sozialdemokratisch", "liberal", "sozialistisch", "grün",
    "national-konservativ", "ns / antisemitisch", "klientel", 
]

const startDate = "1864-01-01T00:00:00";
const stopDate = "2025-12-31T00:00:00";

const standardColor = "#141452";
const highlightColor = "magenta";
const margin = { top: 25, right: 30, bottom: 5, left: 30 }
const padding = 15

const getTransition = () => {
    return d3_transition.transition().duration(350).ease(d3_ease.easeLinear);
}

function App (){

    const mainRef = useRef();
    const windowSize = useWindowSize();
    const [firstSet, setFirstSet] = useState(false)
    const [killSwitch, setKill] = useState(false)

    // state

    const [state, setState] = useState({ 

        width : null,
        sizeDifference : 0,
        mainRef : mainRef,
        breakpoint : 600,
        maxScale : 1000,
        dateOptions : { year: 'numeric', month: 'long' },
        dateOptionsStory : { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
        transition : getTransition,

        isTouch : check.touchDevice(),

        data : null,

        defaultValues : {
            huerdeDate : "1953-07-08T00:00:00",
            startDate : startDate,
            stopDate : stopDate,
            pos : [new Date(startDate).getTime(), stopDate],
        },
        timeMargin : {
            normal : 100,
            wahlen : 3400,
            wahlenEdge : 300
        },

        margin : margin,
        padding : padding,

        stroemungen : stroemungen,
        highlightColor : highlightColor,
        standardColor : standardColor,

        huerde : {
            opacity : 0.2,
            stroke : "3, 3"
        },
        
        pathOpacity : {
            active : 0.7, disabled : 0.1
        },
        textOpacity : {
            active : 0.7, disabled: 0
        },
        circleOpacity : {
            highlight : 1, active : 0.7, disabled : 0.1
        },
        circleRadius : 3.5,
        graphHighlight : {
            pathActive : 3, pathIdle : 2, clickPathWidth : 11,
            circleActive : 2, circleIdle : 1
        },
        ereignisHandle : {
            opacity : 0.33, color : standardColor
        },
        periodenRect : {
            opacity : 0.23
        },
        transitionDurationZoom : 500,

        lines : null,
        selections : null,
        zoomObject : null
    });

    // mutables

    const [mutables, setMUTABLES] = useReducer(reducer.mutables, {
        handle_perioden : true,
        handle_wahlen : false,
        labelPartei : true,       
    });

    // highlight

    const [highlight, setHIGHLIGHT] = useReducer(reducer.highlight, {
        highlight_main : false,
        ident : null,
        key : null,
        infos : null,
        element : null,
        staat : null
    })

    // parteien
    const [parteienState, setPARTEI] = useReducer(reducer.partei, {})

    // FIRST DRAW:

    useEffect(() => {
        if(!firstSet){
            console.log("INIT")
            const sizeData = calc.size({
                ...state,
                startDate : startDate,
                stopDate : stopDate,
                })

            const data = {
                wahlen : data_wahlen,
                infos : data_infos,
                perioden : data_perioden,
            }

            const newState = {
                ...state,
                ...sizeData,
                data : {
                    ...data,
                    stroemungen : calc.setStroemungen(data_infos, stroemungen),
                    pathWahlen : calc.setWahlData({...state, data : data}),
                }
            }
            setState(newState);
            setPARTEI({ 
                type : "INIT",
                value : calc.setInitParteiState(data.infos, stroemungen), 
                data : data.infos,
            });     
            setFirstSet(true)
        }
    },[state, firstSet]);

    useEffect(() => { 
        console.log("resize")

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
        mutables : mutables,
        setMUTABLES : setMUTABLES,
        highlight : highlight,
        setHIGHLIGHT : setHIGHLIGHT,
        parteienState : parteienState,
        setPARTEI : setPARTEI,
        killSwitch : killSwitch
    }

    if(firstSet){
        return(
            <div ref = {mainRef}>
                <div style = {{flexWrap: "wrap", display: "flex", width: "100%" }} >  
                    <div style = {{ marginLeft: margin.left}}>
                        { "pv-Zeitstrahl 0.1" } 
                    </div>
                    <MainGraph {...mainProps} />
                    <div style = {{backgroundColor: "magenta", color: "white", marginLeft: margin.left, display : highlight.highlight_main ? "block" : "none"}}>
                        {highlight.highlight_main ? "HIGHLIGHT: " + highlight.element.Name : ""}
                        <button onClick = { () => { console.log("?!"); setKill(() =>  killSwitch ? false : true) }}>cancel
                        </button>
                    </div>
                    <div style ={{width:"100%", marginLeft: margin.left}}>
                        <div style ={{width:"100%"}}>
                            <Checkboxes
                                mutables = { mutables }
                                highlight = { highlight }
                                setMUTABLES = { setMUTABLES }
                            />
                        </div>
                        <Filter {...mainProps}/>
                    </div>

                </div>
            </div>
        )
    }
    else{
        return(
            <div ref = { mainRef } >
                <div style = {{ overflow : "hidden", display: "flex" }}>
                    <span style = {{ display: "flex", alignItems: "center", justifyContent: "center", height: 500, width: "100%"}}>
                        Wird geladen
                    </span>
                </div>
            </div>
        )
    }
}

ReactDOM.render( <App/>, document.getElementById('root') );

