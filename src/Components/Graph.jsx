import React, { useState, useEffect, useCallback, useRef, useReducer} from 'react';

import { useKeyPress } from "../helper/hooks.js";

import * as d3_select from 'd3-selection';
import * as d3_zoom from 'd3-zoom';

import * as linesPatterns from '../graphics/draw/patternsLines.js';
import * as svgDef from '../graphics/draw/defs.js';
import * as curves from  '../graphics/draw/curves.js';
import * as axis from  '../graphics/draw/axis.js';
import * as label from  '../graphics/draw/label.js';
import * as misc from  '../graphics/draw/misc.js';
import * as navigation from  '../graphics/draw/navigation.js';
import { deleteTooltip } from '../graphics/draw/toolTips.js';
import * as lines from  '../graphics/draw/lines.js';
import * as highlighter from  '../graphics/draw/highlighter.js';

import * as zoomGraph from  '../graphics/update/zoom.js';
import * as toggle from  '../graphics/update/toggle.js';

import * as zoomHelper from  '../helper/zoom.js';

import * as d3Zoom from  '../helper/events/zoom.js';

import * as calc from  '../helper/calc_set.js';
import * as check from  '../helper/check.js';

import * as handleEvents from  '../helper/events/events.js';

import ZoomMenu from './ZoomMenu';
import PeriodeSelect from './SelectPeriode';

import * as reducer from "../helper/reducer.js"

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

    // Callbacks

    const killSwitch = useCallback(()=>{
        
        if(stateRefs.current.newProps.highlight && stateRefs.current.newProps.firstSet && stateRefs.current.isDrawed){
            stateRefs.current.newProps.setHIGHLIGHT({ type : "KILL_HIGHLIGHT_MAIN" })
            if(stateRefs.current.newProps.highlight.ident === "partei") stateRefs.current.newProps.setPARTEI({ type: "KILL_HIGHLIGHT_PARTEI"})
            handleEvents.toggle(stateRefs.current.newProps, false, "switch", "click")
        }
    },[])

    const zoomIt = useCallback(() => {
        if(stateRefs.current.newProps.firstSet && stateRefs.current.isDrawed) {
            const newXScale = stateRefs.current.zoomState.rescaleX(stateRefs.current.newProps.state.x_scale);
            const range = newXScale.range().map(stateRefs.current.zoomState.invertX, stateRefs.current.zoomState);

            stateRefs.current.newProps.state.selections.context.call(zoomObjRefs.current.brush.move, range);
            zoomGraph.curves(stateRefs.current.newProps, newXScale); 
    
            if(stateRefs.current.newProps.mutables.handle_perioden) zoomGraph.perioden(stateRefs.current.newProps, newXScale)
            if(stateRefs.current.newProps.mutables.handle_wahlen) zoomGraph.highlightLines(stateRefs.current.newProps, newXScale, "wahlen")
            
            if(stateRefs.current.newProps.highlight.ident === "perioden"){ zoomGraph.highlights(stateRefs.current.newProps, newXScale, "main");}
    
            zoomGraph.bg(stateRefs.current.newProps, newXScale, "mainGraphBG");
            zoomGraph.jetzt(stateRefs.current.newProps, newXScale);
            zoomGraph.xAxis(stateRefs.current.newProps, newXScale, "main");
        }
    },[])

    const brushIt = useCallback(()=>{
        if(stateRefs.current.newProps.firstSet && stateRefs.current.brushState !== null && stateRefs.current.isDrawed){
            stateRefs.current.newProps.state.selections.mainGraph.call(
                zoomObjRefs.current.zoom.transform, 
                    d3_zoom.zoomIdentity
                        .scale(stateRefs.current.brushState.k)
                        .translate(stateRefs.current.brushState.x, 0)
            );
        }
    },[])

    const setSelections = useCallback(()=>{
        stateRefs.current.newProps.setState({
            ...stateRefs.current.newProps.state,
            zoomObject : zoomObjRefs.current.zoom,
            lines : {
                partei : d3Refs.current.linePartei,
            },
            selections : {
                // zoom
                container : d3_select.select(svg_ref.current),
                navContainer : d3_select.select(nav_ref.current),
                // main
                mainGraph : d3_select.select("#mainGraph"),
                mainGraphBG : d3_select.select("#mainGraphBG"),
                // zoom / context
                context : d3_select.select(".context"),
                // wahlenGraph:
                pathCircleGroup : d3_select.select("#pathCircleGroup"),
                paths : d3_select.selectAll(".parteiKurven"),
                pathsClick : d3_select.selectAll(".parteiKurven_click"), 
                circles : d3_select.selectAll(".parteiCircles").selectAll("circle"),
                fuenfProzentX : d3_select.select("#fuenfProzent_x"),
                fuenfProzentY : d3_select.select("#fuenfProzent_y"),
                // perioden
                perioden : d3_select.selectAll(".periodenGroup"),
                periodenHL : d3_select.selectAll(".highlightLine_perioden"),
                // wahlen
                wahlen : d3_select.selectAll(".wahlenGroup"), 
                wahlenSymbol : d3_select.selectAll(".wahlenSymbol"),
                highlightLinesWahlenG : d3_select.selectAll(".highlightLine_wahlen"),
                // label
                parteiLabel : d3_select.selectAll(".parteiLabel"),
                yAxisLabelWahlen : d3_select.selectAll("#yAxisLabel_wahlen_extra,#yAxisLabel_wahlen"),
                // X-Achsen:
                xAxis : d3_select.selectAll(".xAxis"),
                xAxisLines : d3_select.selectAll(".xAxisLines"),
                // Y-Achsen
                yAxis : d3_select.select("#y_axis"),
                yAxisLines : d3_select.selectAll("#y_axis_lines"),
                // Highlighter
                mainHL : d3_select.select("#BarHighLight_main"),
                navHL : d3_select.select("#BarHighLight_nav"),
                HL_NavLine : d3_select.select("#navLine").select("line"),
                // jetzt 
                jetzt : d3_select.selectAll(".jetzt"),
            },
            selectionsSet : true
        })
    },[])

    const drawIt = useCallback(()=>{

        const svg = d3_select.select(svg_ref.current)
        const nav = d3_select.select(nav_ref.current)

        const defs = svg.append("defs").attr("id", "graphDefs");

        svgDef.set(defs, stateRefs.current.newProps);

        const mainGraph = svg.append("g").attr("id", "mainGraph")
            .attr('transform', `translate(${ stateRefs.current.newProps.state.graph.x},${ stateRefs.current.newProps.state.graph.y})`)
            .attr("opacity", 1)

        const mainGraphBG = mainGraph.append("g").attr("id", "mainGraphBG")

        const navGroup = nav.append("g").attr("id", "navGroup")
            .attr('transform', `translate(${ stateRefs.current.newProps.state.navigation.x},${0})`)

        linesPatterns.graphBackground(mainGraphBG, stateRefs.current.newProps, "graph", false)
        linesPatterns.frame(mainGraph, stateRefs.current.newProps)
        misc.jetzt(stateRefs.current.newProps, mainGraph, "main")

        // wahlen
        misc.huerde(stateRefs.current.newProps, mainGraph)
        curves.parteien(mainGraph, stateRefs.current.newProps, d3Refs.linePartei)

        // achsen
        axis.x(stateRefs.current.newProps, mainGraph, "main")
        axis.y(stateRefs.current.newProps, mainGraph)
        // label
        label.yAxis(mainGraph, "wahlen")
        // context
        navigation.context(stateRefs.current.newProps, navGroup, zoomObjRefs.current.brush)

        const periodenGroup = mainGraph.append("g").attr("class", "periodenGroup")
            .attr("opacity", stateRefs.current.newProps.mutables.handle_perioden ? 1 : 0)
        const wahlenGroup = mainGraph.append("g").attr("class", "wahlenGroup")
            .attr("opacity", stateRefs.current.newProps.mutables.handle_wahlen ? 1 : 0)

        linesPatterns.highlightLine(stateRefs.current.newProps, periodenGroup, "perioden");
        linesPatterns.highlightLine(stateRefs.current.newProps, wahlenGroup, "wahlen")

        highlighter.recGraph(stateRefs.current.newProps, mainGraph, "main")

        mainGraph.call(zoomObjRefs.current.zoom)
            .on("wheel.zoom", null)
            //.on("dblclick.zoom", null);

        zoomHelper.initZoom(mainGraph, zoomObjRefs.current.zoom, stateRefs.current.newProps.zoomInfo, stateRefs.current.newProps)

    },[])

    const removeElAndNewZoom = useCallback(()=>{
        zoomObjRefs.current.zoom = d3Zoom.zoom(stateRefs.current.newProps, setZoomState, setZOOMINFO)
        zoomObjRefs.current.brush = d3Zoom.brush(stateRefs.current.newProps, setBrushState)
        d3Refs.current.linePartei = lines.curve(stateRefs.current.newProps, "partei")
        stateRefs.current.newProps.state.selections.container.select("defs").remove()
        stateRefs.current.newProps.state.selections.container.select("#mainGraph").remove()
        stateRefs.current.newProps.state.selections.navContainer.select("#navGroup").remove()
    },[])

    const handleMouse = useCallback(()=>{

        if(stateRefs.current.newProps.firstSet && stateRefs.current.isDrawed){

            const { mouseEvents : mouse } = stateRefs.current.newProps
            const { highlight } = stateRefs.current.newProps

            const same = check.sameHighlight (stateRefs.current.newProps, mouse.type, mouse.key)
            const isPeriod = mouse.type === "perioden"
            const wasPeriod = highlight.ident === "perioden"

            if(mouse.mouseEvent === "enter") {
                handleEvents.toggle(stateRefs.current.newProps, true, "new", mouse.mouseEvent); 
                handleEvents.showTooltip(stateRefs.current.newProps)}
            else if(mouse.mouseEvent === "leave") { 
                if((!highlight.highlight_main && !same) || (!highlight.highlight_main && same)){
                    deleteTooltip(); 
                    handleEvents.toggle(stateRefs.current.newProps, false, "new", mouse.mouseEvent); 
                }
                else if(highlight.highlight_main && !same){
                    deleteTooltip(); 
                    handleEvents.toggle(stateRefs.current.newProps, false, "new", mouse.mouseEvent); 
                }
            }

            else if(mouse.mouseEvent === "click") {
                deleteTooltip();
                // highlight switch
                if (highlight.highlight_main && !same){
                    if((isPeriod && wasPeriod)){
                        handleEvents.toggle(stateRefs.current.newProps, true, "new", mouse.mouseEvent)
                    }
                    else {
                        handleEvents.toggle(stateRefs.current.newProps, false, "switch", mouse.mouseEvent)
                        handleEvents.toggle(stateRefs.current.newProps, true, "new", mouse.mouseEvent)
                    }
                }
                // highlight off
                else if(highlight.highlight_main && same){
                    handleEvents.toggle(stateRefs.current.newProps, false, "switch", mouse.mouseEvent)
                }
                // highlight new
                else if(!highlight.highlight_main){
                    handleEvents.toggle(stateRefs.current.newProps, true, "new", mouse.mouseEvent)
                }

                const setType = (highlight.highlight_main && same) ? 
                    "KILL_HIGHLIGHT_MAIN" : "HIGHLIGHT_MAIN";

                stateRefs.current.newProps.setHIGHLIGHT({
                    type : setType,
                    infos :  stateRefs.current.newProps.state.data[mouse.dataSet],
                    key : mouse.key,
                    ident : mouse.type,
                    element : calc.getElement(stateRefs.current.newProps.state.data[mouse.dataSet], mouse.keyName, mouse.key)
                })

                switch(mouse.type){
                    case "partei":
                        stateRefs.current.newProps.setPARTEI({
                            type : "PARTEI_HIGHLIGHT",
                            highlight : highlight,
                            partei : mouse.key,
                        });
                        break;
                    default :
                        break;
                }
                if(highlight.ident === "partei" && mouse.type !== "partei" ){
                    stateRefs.current.newProps.setPARTEI({ type : "KILL_HIGHLIGHT_PARTEI" });
                }
            }
        }   
    },[])

    // Effects:

    // SET:

    useEffect(()=>{ 
        if(stateRefs.current.newProps.firstSet && !stateRefs.current.isDrawed) {
            drawIt()
            setSelections()
            drawed(true)
        }; 
    }, [drawIt, setSelections])

    // RESIZE:

    useEffect(()=>{ 
        if(stateRefs.current.newProps.firstSet && stateRefs.current.newProps.state.selectionsSet && stateRefs.current.isDrawed) {
            removeElAndNewZoom()
            drawIt()
            setSelections()
        }
    }, [props.state.width, removeElAndNewZoom, drawIt, setSelections])

    // ZOOM AND BRUSH:

    useEffect(()=>{ 
        zoomIt() 
    }, [zoomState, zoomIt])

    useEffect(()=>{
        brushIt()
    }, [brushState, brushIt])

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
        handleMouse()
    }, [mouseEvents.e, handleMouse])

    useEffect(()=>{ 
        if(stateRefs.current.newProps.firstSet && stateRefs.current.isDrawed) {
            toggle.curves(stateRefs.current.newProps); 
        }
    }, [props.parteienState])

    // ESCAPE:
    useEffect(()=>{
        killSwitch()
    }, [keyPress, props.killSwitch, killSwitch])

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
                <ZoomMenu {...stateRefs.current.newProps}/>
                <PeriodeSelect {...stateRefs.current.newProps}/>
            </div>
        </div>
    )
}

