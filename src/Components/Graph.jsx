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

    const newProps = {
        ...props, 
        zoomInfo : zoomInfo,
        mouseEvents : mouseEvents,
        setMOUSE : setMOUSE
    }

    // Refs:

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
        isDrawed : isDrawed,
        newProps : newProps,
        zoomState : zoomState,
        brushState : brushState,
    });

    useEffect(()=>{
        if(isDrawed) stateRefs.current.isDrawed = isDrawed
        stateRefs.current.newProps = newProps
        stateRefs.current.zoomState = zoomState
        stateRefs.current.brushState = brushState
    })

    const removeElAndNewZoom = () => {
        zoomObjRefs.current.zoom = d3Zoom.zoom(stateRefs.current.newProps, setZoomState, setZOOMINFO)
        zoomObjRefs.current.brush = d3Zoom.brush(stateRefs.current.newProps, setBrushState)
        d3Refs.current.linePartei = lines.curve(stateRefs.current.newProps, "partei")
        stateRefs.current.newProps.state.selections.container.select("defs").remove()
        stateRefs.current.newProps.state.selections.container.select("#mainGraph").remove()
        stateRefs.current.newProps.state.selections.navContainer.select("#navGroup").remove()
    };

    useEffect(()=>{ 
        if(stateRefs.current.newProps.firstSet && !stateRefs.current.isDrawed) {
            helper.drawIt(svg_ref, nav_ref, stateRefs, d3Refs, zoomObjRefs)
            helper.setSelections(stateRefs, zoomObjRefs, d3Refs, svg_ref, nav_ref)
            drawed(true)
        }; 
    }, [])

    // RESIZE:

    useEffect(()=>{ 
        if(stateRefs.current.newProps.firstSet && stateRefs.current.newProps.state.selectionsSet && stateRefs.current.isDrawed) {
            removeElAndNewZoom()
            helper.drawIt(svg_ref, nav_ref, stateRefs, d3Refs, zoomObjRefs)
            helper.setSelections(stateRefs, zoomObjRefs, d3Refs, svg_ref, nav_ref)
        }
    }, [props.state.width])

    // ZOOM AND BRUSH:

    useEffect(()=>{ 
        helper.zoomIt(stateRefs, zoomObjRefs) 
    }, [zoomState])

    useEffect(()=>{
        helper.brushIt(stateRefs, zoomObjRefs)
    }, [brushState])

    // TOGGLE HANDLES:

    useEffect(()=>{ 
        if(stateRefs.current.newProps.firstSet && stateRefs.current.isDrawed){
            zoomGraph.perioden(stateRefs.current.newProps, stateRefs.current.newProps.zoomInfo.zoomScale)
            toggle.handles(stateRefs.current.newProps, "perioden", props.mutables.handle_perioden)
        }
    }, [props.mutables.handle_perioden])
    useEffect(()=>{ 
        if(stateRefs.current.newProps.firstSet && stateRefs.current.isDrawed){
            zoomGraph.highlightLines(stateRefs.current.newProps, stateRefs.current.newProps.zoomInfo.zoomScale, "wahlen")
            toggle.handles(stateRefs.current.newProps, "wahlen", props.mutables.handle_wahlen)
        }
    }, [props.mutables.handle_wahlen])
    useEffect(()=>{ 
        if(stateRefs.current.newProps.firstSet && stateRefs.current.isDrawed){
            toggle.label(stateRefs.current.newProps); 
        }
    }, [props.mutables.labelPartei])

    useEffect(()=>{
        helper.handleMouse(stateRefs)
    }, [mouseEvents.e])

    useEffect(()=>{ 
        if(stateRefs.current.newProps.firstSet && stateRefs.current.isDrawed) {
            toggle.curves(stateRefs.current.newProps); 
        }
    }, [props.parteienState])

    // ESCAPE:
    useEffect(()=>{
        helper.killSwitch(stateRefs)
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

