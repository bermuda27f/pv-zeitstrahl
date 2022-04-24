import React, { useState, useEffect, useRef, useReducer} from 'react';
import ZoomMenu from './ZoomMenu';

import { useKeyPress } from "../helper/hooks.js";

import * as lines from  '../graphics/draw/lines.js';
import * as zoomGraph from  '../graphics/update/zoom.js';
import * as toggle from  '../graphics/update/toggle.js';
import * as d3Zoom from  '../helper/events/zoom.js';
import * as calc from  '../helper/calc_set.js';

import * as reducer from "../helper/reducer.js"
import * as helper from "../helper/components/graph.js"

export default function Graph (props) {

    const keyPress = useKeyPress("Escape");
    const [isDrawed, drawed] = useState(false);
    const [zoomState, setZoomState] = useState(null)
    const [brushState, setBrushState] = useState(null)
    const [zoomInfo, setZOOMINFO] = useReducer(reducer.mutables, {
        zoomScale : null,
        zoomState : null,
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
    const nav_ref = useRef()
    const zoomObjRefs = useRef({
        zoom : d3Zoom.zoom(props, setZoomState, setZOOMINFO),
        brush : d3Zoom.brush(props, setBrushState),
    })
    const d3Refs = useRef({
        linePartei : lines.curve(props, "partei")
    })
    const stateRefs = useRef({
        ...props, 
        zoomInfo : zoomInfo,
        mouseEvents : mouseEvents,
        isDrawed : isDrawed,
        zoomState : zoomState,
        brushState : brushState,
        setMOUSE : setMOUSE
    });

    useEffect(()=>{
        stateRefs.current.firstSet = props.firstSet;
        stateRefs.current.state = props.state;
        stateRefs.current.mutables = props.mutables;
        stateRefs.current.highlight = props.highlight;
        stateRefs.current.parteienState = props.parteienState;
        stateRefs.current.zoomInfo = zoomInfo;
        stateRefs.current.mouseEvents = mouseEvents;
        stateRefs.current.isDrawed = isDrawed;
        stateRefs.current.zoomState = zoomState;
        stateRefs.current.brushState = brushState;
    })

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
        if(stateRefs.current.firstSet && stateRefs.current.state.selectionsSet && stateRefs.current.isDrawed) {
            removeElAndNewZoom()
            helper.drawIt(svg_ref, nav_ref, stateRefs.current, d3Refs, zoomObjRefs)
            helper.setSelections(stateRefs.current, zoomObjRefs, d3Refs, svg_ref, nav_ref)
        }
    }, [props.state.width])

    // ZOOM AND BRUSH:

    useEffect(()=>{ 
        helper.zoomIt(stateRefs.current, zoomObjRefs) 
    }, [zoomState])

    useEffect(()=>{
        helper.brushIt(stateRefs.current, zoomObjRefs)
    }, [brushState])

    // TOGGLE HANDLES:

    useEffect(()=>{ 
        if(stateRefs.current.firstSet && stateRefs.current.isDrawed){
            zoomGraph.perioden(stateRefs.current, stateRefs.current.zoomInfo.zoomScale)
            toggle.handles(stateRefs.current, "perioden", props.mutables.handle_perioden)
        }
    }, [props.mutables.handle_perioden])
    useEffect(()=>{ 
        if(stateRefs.current.firstSet && stateRefs.current.isDrawed){
            zoomGraph.highlightLines(stateRefs.current, stateRefs.current.zoomInfo.zoomScale, "wahlen")
            toggle.handles(stateRefs.current, "wahlen", props.mutables.handle_wahlen)
        }
    }, [props.mutables.handle_wahlen])
    useEffect(()=>{ 
        if(stateRefs.current.firstSet && stateRefs.current.isDrawed){
            toggle.label(stateRefs.current); 
        }
    }, [props.mutables.labelPartei])

    useEffect(()=>{
        helper.handleMouse(stateRefs.current)
    }, [mouseEvents.e])

    useEffect(()=>{ 
        if(stateRefs.current.firstSet && stateRefs.current.isDrawed) {
            toggle.curves(stateRefs.current); 
        }
    }, [props.parteienState])

    // ESCAPE:
    useEffect(()=>{
        helper.killSwitch(stateRefs.current)
    }, [keyPress, props.killSwitch])

    return (
        <div>
            <div>
                <div style = {{ textAlign: "right", marginRight: props.state.margin.right + props.state.padding}} >
                    <div> { "period: " + calc.zeit(props, zoomInfo) } </div>
                    <div> { "~ " + calc.dauer(zoomInfo)  }</div>
                </div>
                <svg
                    id = "SVG_CONTAINER"
                    ref = { svg_ref }
                    width = { props.state.mainRefSize - props.state.padding }
                    height = { props.state.mainGraphHeight }
                />
                <svg
                    id = "NAV_CONTAINER"
                    ref = { nav_ref }
                    width = { props.state.mainRefSize - props.state.padding }
                    height = { props.state.navigation.height + props.state.navigation.y }
                />
            </div>
            <div style ={{display: "flex", width:"100%", marginLeft: props.state.margin.left}}>
                <ZoomMenu
                    state = { props.state }
                    zoomState = { zoomState }
                    zoomInfo = { zoomInfo }
                />
            </div>
        </div>
    )
}

