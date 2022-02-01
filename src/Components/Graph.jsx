import React, { useState, useEffect, useCallback, useMemo, useRef, useReducer} from 'react';

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
import * as lines from  '../graphics/draw/lines.js';
import * as highlighter from  '../graphics/draw/highlighter.js';

import * as zoomGraph from  '../graphics/update/zoom.js';
import * as zoomHelper from  '../helper/zoom.js';

import * as toggle from  '../graphics/update/toggle.js';
import * as d3Zoom from  '../helper/events/zoom.js';

import * as calc from  '../helper/calc_set.js';
import * as check from  '../helper/check.js';
import * as handleEvents from  '../helper/events/events.js';
import { deleteTooltip } from '../graphics/draw/toolTips.js';

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

    const { 
        width 
    } = props.state

    const {
        handle_perioden,
        handle_wahlen,
        labelPartei,
    } = props.mutables

    const {
        highlight_main,
        ident,
    } = props.highlight

    const {
        mouseEvent,
        type,
        key,
        keyName,
        dataSet,
        e : mouseE,
    } = mouseEvents

    const newProps = useMemo(()=>{
        return {
            ...props, 
            zoomInfo : zoomInfo,
            mouseEvents : mouseEvents,
            setMOUSE : setMOUSE
        }
    })

    // Refs:

    const svgRefs = useRef({
        main : null,
        nav : null
    })

    // const svg_ref = useRef()
    // const nav_ref = useRef()
    const zoomRefs = useRef({
        zoom : d3Zoom.zoom(props, setZoomState, setZOOMINFO),
        brush : d3Zoom.brush(props, setBrushState),
        linePartei : lines.curve(props, "partei")
    })
    const mutableRefs = useRef({
        highlight : highlight_main,
        isDrawed : isDrawed,
        newProps : newProps,
        ident : ident,
        zoom : zoom,
        zoomState : zoomState,
        brushState : brushState,
        brush : brush,
        handle_perioden : handle_perioden,
        handle_wahlen : handle_wahlen
    });

    useEffect(()=>{
        mutableRefs.current.highlight = highlight_main
        mutableRefs.current.isDrawed = isDrawed
        mutableRefs.current.newProps = newProps
        mutableRefs.current.ident = ident
        mutableRefs.current.zoom = zoom
        mutableRefs.current.zoomState = zoomState
        mutableRefs.current.brushState = brushState
        mutableRefs.current.brush = brush
        mutableRefs.current.handle_perioden = handle_perioden
        mutableRefs.current.handle_wahlen = handle_wahlen
    })

    // Callbacks

    const killSwitch = useCallback(()=>{
        if(mutableRefs.current.highlight && mutableRefs.current.newProps.firstSet && mutableRefs.current.isDrawed){
            mutableRefs.current.newProps.setHIGHLIGHT({ type : "KILL_HIGHLIGHT_MAIN" })
            if(mutableRefs.current.ident === "partei") mutableRefs.current.newProps.setPARTEI({ type: "KILL_HIGHLIGHT_PARTEI"})
            handleEvents.toggle(mutableRefs.current.newProps, false, "switch", "click")
        }
    },[])

    const zoomIt = useCallback(() => {
        if(mutableRefs.current.newProps.firstSet && mutableRefs.current.isDrawed) {
            const newXScale = mutableRefs.current.zoomState.rescaleX(mutableRefs.current.newProps.state.x_scale);
            const range = newXScale.range().map(mutableRefs.current.zoomState.invertX, mutableRefs.current.zoomState);
    
            mutableRefs.current.newProps.state.selections.context.call(mutableRefs.current.brush.move, range);
            zoomGraph.curves(mutableRefs.current.newProps, newXScale); 
    
            if(mutableRefs.current.handle_perioden) zoomGraph.perioden(mutableRefs.current.newProps, newXScale)
            if(mutableRefs.current.handle_wahlen) zoomGraph.highlightLines(mutableRefs.current.newProps, newXScale, "wahlen")
            
            if(mutableRefs.current.ident === "perioden"){ zoomGraph.highlights(mutableRefs.current.newProps, newXScale, "main");}
    
            zoomGraph.bg(mutableRefs.current.newProps, newXScale, "mainGraphBG");
            zoomGraph.jetzt(mutableRefs.current.newProps, newXScale);
            zoomGraph.xAxis(mutableRefs.current.newProps, newXScale, "main");
        }
    },[])

    const brushIt = useCallback(()=>{
        if(mutableRefs.current.newProps.firstSet && mutableRefs.current.brushState !== null && mutableRefs.current.isDrawed){
            mutableRefs.current.newProps.state.selections.mainGraph.call(
                mutableRefs.current.zoom.transform, 
                    d3_zoom.zoomIdentity
                        .scale(mutableRefs.current.brushState.k)
                        .translate(mutableRefs.current.brushState.x, 0)
            );
        }
    }, [])

    const setSelections = useCallback(()=>{
        props.setState({
            ...props.state,
            zoomObject : zoom,
            lines : {
                partei : linePartei,
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
    },[
        props,
        zoom,
        linePartei,
        // refs.svg_ref,
        // refs.nav_ref
    ])

    const drawIt = useCallback(()=>{

        const svg = d3_select.select(svg_ref.current)
        const nav = d3_select.select(nav_ref.current)

        const defs = svg.append("defs").attr("id", "graphDefs");

        svgDef.set(defs, props);

        const mainGraph = svg.append("g").attr("id", "mainGraph")
            .attr('transform', `translate(${props.state.graph.x},${props.state.graph.y})`)
            .attr("opacity", 1)

        const mainGraphBG = mainGraph.append("g").attr("id", "mainGraphBG")

        const navGroup = nav.append("g").attr("id", "navGroup")
            .attr('transform', `translate(${props.state.navigation.x},${0})`)

        linesPatterns.graphBackground(mainGraphBG, newProps, "graph", false)
        linesPatterns.frame(mainGraph, newProps)
        misc.jetzt(newProps, mainGraph, "main")

        // wahlen
        misc.huerde(newProps, mainGraph)
        curves.parteien(mainGraph, newProps, linePartei)

        // achsen
        axis.x(newProps, mainGraph, "main")
        axis.y(newProps, mainGraph)
        // label
        label.yAxis(newProps, mainGraph, "wahlen")
        // context
        navigation.context(newProps, navGroup, brush)

        const periodenGroup = mainGraph.append("g").attr("class", "periodenGroup")
            .attr("opacity", newProps.mutables.handle_perioden ? 1 : 0)
        const wahlenGroup = mainGraph.append("g").attr("class", "wahlenGroup")
            .attr("opacity", newProps.mutables.handle_wahlen ? 1 : 0)

        linesPatterns.highlightLine(newProps, periodenGroup, "perioden");
        linesPatterns.highlightLine(newProps, wahlenGroup, "wahlen")

        highlighter.recGraph(props, mainGraph, "main")

        mainGraph.call(zoom)
            .on("wheel.zoom", null)
            //.on("dblclick.zoom", null);

        zoomHelper.initZoom(mainGraph, zoom, zoomInfo, newProps)

    },[
        props,
        svg_ref,
        nav_ref,
        newProps,
        brush,
        zoom,
        zoomInfo,
        linePartei
    ])

    // Effects:

    // SET:

    useEffect(()=>{ 
        if(props.firstSet && !isDrawed) {
            drawIt()
            setSelections()
            drawed(true)
        }; 
    }, [
        props.firstSet,
        isDrawed,
        drawIt,
        setSelections
    ])

    // RESIZE:

    useEffect(()=>{ 
        if(props.firstSet && props.state.selectionsSet && isDrawed) {
            props.state.selections.container.select("defs").remove()
            props.state.selections.container.select("#mainGraph").remove()
            props.state.selections.navContainer.select("#navGroup").remove()
            drawIt();
            setSelections()
            console.log("resize")
        }
    }, [
        width,
        props.firstSet,
        isDrawed,
        //props,
        //drawIt
    ])

    // ZOOM AND BRUSH:

    useEffect(()=>{ 
        zoomIt() 
    }, [zoomState, zoomIt])

    useEffect(()=>{
        brushIt()
    }, [brushState, brushIt])

    // TOGGLE HANDLES:

    useEffect(()=>{ 
        if(props.firstSet && isDrawed){
            zoomGraph.perioden(newProps, zoomInfo.zoomScale)
            toggle.handles(newProps, "perioden", handle_perioden)
        }
    }, [handle_perioden])
    useEffect(()=>{ 
        if(props.firstSet && isDrawed){
            zoomGraph.highlightLines(newProps, zoomInfo.zoomScale, "wahlen")
            toggle.handles(newProps, "wahlen", handle_wahlen)
        }
    }, [handle_wahlen])
    useEffect(()=>{ 
        if(props.firstSet && isDrawed){
            toggle.label(newProps); 
        }
    }, [labelPartei])

    // MOUSE:

    useEffect(()=>{

        if(props.firstSet && isDrawed){

            const same = check.sameHighlight (newProps, type, key)
            const isPeriod = type === "perioden"
            const wasPeriod = ident === "perioden"

            if(mouseEvent === "enter") {
                handleEvents.toggle(newProps, true, "new", mouseEvent); 
                handleEvents.showTooltip(newProps)}
            else if(mouseEvent === "leave") { 
                if((!highlight_main && !same) || (!highlight_main && same)){
                    deleteTooltip(); 
                    handleEvents.toggle(newProps, false, "new", mouseEvent); 
                }
                else if(highlight_main && !same){
                    deleteTooltip(); 
                    handleEvents.toggle(newProps, false, "new", mouseEvent); 
                }
            }

            else if(mouseEvent === "click") {
                deleteTooltip();
                // highlight switch
                if (highlight_main && !same){
                    if((isPeriod && wasPeriod)){
                        handleEvents.toggle(newProps, true, "new", mouseEvent)
                    }
                    else {
                        handleEvents.toggle(newProps, false, "switch", mouseEvent)
                        handleEvents.toggle(newProps, true, "new", mouseEvent)
                    }
                }
                // highlight off
                else if(highlight_main && same){
                    handleEvents.toggle(newProps, false, "switch", mouseEvent)
                }
                // highlight new
                else if(!highlight_main){
                    handleEvents.toggle(newProps, true, "new", mouseEvent)
                }

                let setType = (highlight_main && same) ? 
                    "KILL_HIGHLIGHT_MAIN" : "HIGHLIGHT_MAIN";

                props.setHIGHLIGHT({
                    type : setType,
                    infos :  props.state.data[dataSet],
                    key : key,
                    ident : type,
                    element : calc.getElement(props.state.data[dataSet], keyName, key)
                })

                switch(type){
                    case "partei":
                        props.setPARTEI({
                            type : "PARTEI_HIGHLIGHT",
                            highlight : props.highlight,
                            partei : key,
                        });
                        break;
                    default :
                        break;
                }
                if(ident === "partei" && type !== "partei" ){
                    props.setPARTEI({ type : "KILL_HIGHLIGHT_PARTEI" });
                }
            }
        }
    }, [mouseE])

    useEffect(()=>{ 
        if(props.firstSet && isDrawed) toggle.curves(props); 
    }, [
        props.firstSet,
        isDrawed,
        props,
        props.parteienState
    ])

    // ESCAPE:
    useEffect(()=>{
        killSwitch()
    }, [
        keyPress, 
        props.killSwitch,
        killSwitch
    ])

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
                <ZoomMenu {...newProps}/>
                <PeriodeSelect {...newProps}/>
            </div>
        </div>
    )
}

