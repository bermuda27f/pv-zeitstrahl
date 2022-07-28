import React, { useState, useEffect, useRef, useReducer} from 'react';
import ZoomMenu from './ZoomMenu';
import Checkboxes from './Checkboxes';
import SortType from './SortType';

import '../styles.css'

import { useKeyPress } from "../helper/hooks.js";

import * as zoomGraph from  '../graphics/update/zoom.js';
import * as toggle from  '../graphics/update/toggle.js';
import * as d3Zoom from  '../helper/events/zoom.js';
import * as calc from  '../helper/calc_set.js';
import * as check from  '../helper/check.js';

import * as events from  '../graphics/draw/events.js';

import * as reducer from "../helper/reducer.js"
import * as helper from "../helper/components/graph.js"

export default function Graph (props) {

    const [infoElements, setINFOELEMENTS] = useReducer(reducer.mutables, {
        events : true,
        label : true,
        map : true,
        sortType : "time"
    });

    const keyPress = useKeyPress("Escape");
    const [isDrawed, drawed] = useState(false);
    const [zoomState, setZoomState] = useState(null)

    const [zoomInfo, setZOOMINFO] = useReducer(reducer.mutables, {
        scale : null,
        transform : null,
        range : null,
        _start_: null,
        _stop_: null,
        _startDate: null,
        _stopDate: null,
    })
    const [mouseEvents, setMOUSE] = useReducer(reducer.mutables, {
        mouseEvent : null,
        type : null,
        key : null,
        dataSet : null,
        e : null,
    })

    // Refs handling:

    const svg_ref = useRef()
    const zoomObjRefs = useRef({
        zoom : d3Zoom.zoom(props, setZoomState, setZOOMINFO),
    })
    const stateRefs = useRef({
        ...props, 
        infoElements : infoElements,
        zoomInfo : zoomInfo,
        mouseEvents : mouseEvents,
        isDrawed : isDrawed,
        zoomState : zoomState,
        setMOUSE : setMOUSE
    });

    useEffect(()=>{ stateRefs.current.state = props.state; }, [props.state])
    useEffect(()=>{ stateRefs.current.firstSet = props.firstSet; }, [props.firstSet])
    useEffect(()=>{ stateRefs.current.highlight = props.highlight; }, [props.highlight])
    useEffect(()=>{ stateRefs.current.infoElements = infoElements; }, [infoElements])
    useEffect(()=>{ stateRefs.current.zoomInfo = zoomInfo; }, [zoomInfo])
    useEffect(()=>{ stateRefs.current.mouseEvents = mouseEvents; }, [mouseEvents])
    useEffect(()=>{ stateRefs.current.isDrawed = isDrawed; }, [isDrawed])
    useEffect(()=>{ stateRefs.current.zoomState = zoomState; }, [zoomState])

    //

    useEffect(()=>{ 
        if(stateRefs.current.firstSet && !stateRefs.current.isDrawed) {
            helper.drawIt(svg_ref, stateRefs.current, zoomObjRefs)
            helper.setSelections(stateRefs.current, zoomObjRefs, svg_ref)
            drawed(true)
        }; 
    }, [])

    // RESIZE:

    useEffect(()=>{ 
        if(stateRefs.current.isDrawed) {
            zoomObjRefs.current.zoom = d3Zoom.zoom(stateRefs.current, setZoomState, setZOOMINFO)
            stateRefs.current.state.selections.container.select("#graphDefs").remove()
            stateRefs.current.state.selections.container.select("#eventGroup").remove()
            stateRefs.current.state.selections.container.select("#zoomGroup").remove()
            stateRefs.current.state.selections.container.select("#axisGroup").remove()
            stateRefs.current.state.selections.container.select("#mapGroup").remove()
            helper.drawIt(svg_ref, stateRefs.current, zoomObjRefs)
            helper.setSelections(stateRefs.current, zoomObjRefs, svg_ref)
        }
    }, [props.state.width])

    useEffect(()=>{ 
        helper.zoomIt(stateRefs.current) 
    }, [zoomState])

    useEffect(()=>{ 
        if(stateRefs.current.firstSet && stateRefs.current.isDrawed){
            const { selections } = stateRefs.current.state
            const { zoomInfo, infoElements } = stateRefs.current
            const visible = check.eventsVisible(stateRefs.current, zoomInfo.scaleX, infoElements.events ? true : false)
            events.set(stateRefs.current, selections.events, zoomInfo.scaleX, visible)
        }
    }, [infoElements.events])

    useEffect(()=>{ 
        if(stateRefs.current.firstSet && stateRefs.current.isDrawed){
            toggle.elementOpacity(stateRefs.current, "label"); 
        }
    }, [infoElements.label])

    useEffect(()=>{ 
        if(stateRefs.current.firstSet && stateRefs.current.isDrawed){
            console.log("wow")
            // zoom 
            // events
            // periods
            // scale
            // update
        }
    }, [infoElements.sortType])

    useEffect(()=>{ 
        if(stateRefs.current.firstSet && stateRefs.current.isDrawed){
            toggle.elementOpacity(stateRefs.current, "map"); 
        }
    }, [infoElements.map])

    useEffect(()=>{
        helper.handleMouse(stateRefs.current)
    }, [mouseEvents.e])

    // ESCAPE:
    useEffect(()=>{
        helper.killSwitch(stateRefs.current)
    }, [keyPress, props.killSwitch])

    return (
        <div>
            <div>
                <div style = {{ textAlign: "right", marginRight: props.state.margin.right }} className = "Text">
                    <div> { "period: " + calc.zeit(props, zoomInfo) } </div>
                    <div> { "~ " + calc.dauer(zoomInfo)  }</div>
                </div>
                <svg
                    id = "SVG_CONTAINER"
                    ref = { svg_ref }
                    width = { props.state.mainRefSize - props.state.padding }
                    height = { props.state.mainGraphHeight }
                />
            </div>
            <div style = {{display : "block", marginLeft: props.state.margin.left}}>
                <div>
                    <SortType 
                        sortType = { infoElements.sortType }
                        setINFOELEMENTS = { setINFOELEMENTS }
                    />
                </div>
                <div style ={{display: "flex", width:"100%"}}>
                    <ZoomMenu
                        state = { props.state }
                        zoomState = { zoomState }
                        zoomInfo = { zoomInfo }
                    />
                </div>
                <div style ={{ width:"100%" }}>
                    <Checkboxes
                        infoElements = { infoElements }
                        highlight = { props.highlight }
                        setINFOELEMENTS = { setINFOELEMENTS }
                    />
                </div>
            </div>
        </div>
    )
}

