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

    const svg_ref = useRef();
    const nav_ref = useRef();
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

    const zoom = d3Zoom.zoom(props, setZoomState, setZOOMINFO)
    const brush = d3Zoom.brush(props, setBrushState);
    const linePartei = lines.curve(props, "partei")

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

    const newProps = useMemo(()=>{ return {
        ...props, 
        zoomInfo : zoomInfo,
        mouseEvents : mouseEvents,
        setMOUSE : setMOUSE
        }
    },[
        props,
        zoomInfo,
        mouseEvents,
        setMOUSE
    ])


    
    const killSwitch = useCallback(()=>{
        if(highlight_main && props.firstSet && isDrawed){
            props.setHIGHLIGHT({ type : "KILL_HIGHLIGHT_MAIN" })
            if(ident === "partei") props.setPARTEI({ type: "KILL_HIGHLIGHT_PARTEI"})
            handleEvents.toggle(newProps, false, "switch", "click")
        }
    },[
        //highlight_main,
        isDrawed,
        //props,
        ident,
        //newProps
    ])

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
        svg_ref,
        nav_ref
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
        const zoomIt = ()=> {
            const newXScale = zoomState.rescaleX(newProps.state.x_scale);
            const range = newXScale.range().map(zoomState.invertX, zoomState);
    
            props.state.selections.context.call(brush.move, range);
    
            zoomGraph.curves(newProps, newXScale); 
    
            if(props.mutables.handle_perioden) zoomGraph.perioden(newProps, newXScale)
            if(props.mutables.handle_wahlen) zoomGraph.highlightLines(newProps, newXScale, "wahlen")
            
            if(props.highlight.ident === "perioden"){ zoomGraph.highlights(newProps, newXScale, "main");}
    
            zoomGraph.bg(newProps, newXScale, "mainGraphBG");
            zoomGraph.jetzt(newProps, newXScale);
            zoomGraph.xAxis(newProps, newXScale, "main");
        }
        if(props.firstSet && isDrawed) zoomIt() 
    }, [
        props.firstSet,
        brush,
        newProps,
        props,
        isDrawed,
        zoomState,
    ])

    useEffect(()=>{
        if(props.firstSet && brushState !== null && isDrawed){
            props.state.selections.mainGraph.call(
                zoom.transform, 
                    d3_zoom.zoomIdentity
                        .scale(brushState.k)
                        .translate(brushState.x, 0)
            );
        }
    }, [
        props.firstSet,
        brushState,
        isDrawed,
        props.state.selections,
        //zoom.transform
    ])

    // Toggle Handles:

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

