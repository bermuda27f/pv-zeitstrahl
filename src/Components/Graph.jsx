import React, { useState, useEffect, useRef, useReducer} from 'react';
import ZoomMenu from './ZoomMenu';
import Checkboxes from './Checkboxes';

import '../styles.css'

import { useKeyPress } from "../helper/hooks.js";

import * as lines from  '../graphics/draw/lines.js';
import * as zoomGraph from  '../graphics/update/zoom.js';
import * as toggle from  '../graphics/update/toggle.js';
import * as d3Zoom from  '../helper/events/zoom.js';
import * as calc from  '../helper/calc_set.js';

import * as reducer from "../helper/reducer.js"
import * as helper from "../helper/components/graph.js"

export default function Graph (props) {

    const [infoElements, setINFOELEMENTS] = useReducer(reducer.mutables, {
        handle_ereignisse : true,
        label : true,       
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
        keyName : null,
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
    useEffect(()=>{ stateRefs.current.brushState = brushState; }, [brushState])

    const removeElAndNewZoom = () => {
        zoomObjRefs.current.zoom = d3Zoom.zoom(stateRefs.current, setZoomState, setZOOMINFO)
        zoomObjRefs.current.brush = d3Zoom.brush(stateRefs.current, setBrushState)
        d3Refs.current.linePartei = lines.curve(stateRefs.current, "partei")
        stateRefs.current.state.selections.container.select("defs").remove()
        stateRefs.current.state.selections.container.select("#mainGraph").remove()
        stateRefs.current.state.selections.navContainer.select("#navGroup").remove()
    };

    //

    useEffect(()=>{ 
        if(stateRefs.current.firstSet && !stateRefs.current.isDrawed) {
            helper.drawIt(svg_ref, nav_ref, stateRefs.current, d3Refs, zoomObjRefs)
            helper.setSelections(stateRefs.current, zoomObjRefs, d3Refs, svg_ref, nav_ref)
            drawed(true)
        }; 
    }, [])

    // RESIZE:

    useEffect(()=>{ 
        if(stateRefs.current.isDrawed) {
            removeElAndNewZoom()
            helper.drawIt(svg_ref, nav_ref, stateRefs.current, d3Refs, zoomObjRefs)
            helper.setSelections(stateRefs.current, zoomObjRefs, d3Refs, svg_ref, nav_ref)
        }
    }, [props.state.width])

    // ZOOM AND BRUSH:

    useEffect(()=>{ 
        helper.zoomIt(stateRefs.current, zoomObjRefs) 
    }, [zoomState])

    // TOGGLE HANDLES:

    useEffect(()=>{ 
        if(stateRefs.current.firstSet && stateRefs.current.isDrawed){
            zoomGraph.highlightLines(stateRefs.current, stateRefs.current.zoomInfo.scale, "wahlen")
            toggle.handles(stateRefs.current, "wahlen", infoElements.handle_wahlen)
        }
    }, [infoElements.handle_wahlen])

    useEffect(()=>{ 
        if(stateRefs.current.firstSet && stateRefs.current.isDrawed){
            toggle.label(stateRefs.current); 
        }
    }, [infoElements.labelPartei])

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

