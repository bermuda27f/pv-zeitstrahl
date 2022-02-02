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

    const newProps = useMemo(()=>{
        return {
            ...props, 
            zoomInfo : zoomInfo,
            mouseEvents : mouseEvents,
            setMOUSE : setMOUSE
        }
    },[
        props,
        zoomInfo,
        mouseEvents
    ])

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
    const mutableRefs = useRef({
        isDrawed : isDrawed,
        newProps : newProps,
        zoomState : zoomState,
        brushState : brushState,
    });

    useEffect(()=>{
        if(isDrawed) mutableRefs.current.isDrawed = isDrawed
        mutableRefs.current.newProps = newProps
        mutableRefs.current.zoomState = zoomState
        mutableRefs.current.brushState = brushState
    })

    const refs = mutableRefs.current

    // Callbacks

    const killSwitch = useCallback(()=>{
        if(refs.newProps.highlight && refs.newProps.firstSet && refs.isDrawed){
            refs.newProps.setHIGHLIGHT({ type : "KILL_HIGHLIGHT_MAIN" })
            if(refs.newProps.highlight.ident === "partei") refs.newProps.setPARTEI({ type: "KILL_HIGHLIGHT_PARTEI"})
            handleEvents.toggle(refs.newProps, false, "switch", "click")
        }
    },[])

    const zoomIt = useCallback(() => {
        if(refs.newProps.firstSet && refs.isDrawed) {
            const newXScale = refs.zoomState.rescaleX(refs.newProps.state.x_scale);
            const range = newXScale.range().map(refs.zoomState.invertX, refs.zoomState);

            refs.newProps.state.selections.context.call(zoomObjRefs.current.brush.move, range);
            zoomGraph.curves(mutableRefs.current.newProps, newXScale); 
    
            if(refs.handle_perioden) zoomGraph.perioden(refs.newProps, newXScale)
            if(refs.handle_wahlen) zoomGraph.highlightLines(refs.newProps, newXScale, "wahlen")
            
            if(refs.ident === "perioden"){ zoomGraph.highlights(refs.newProps, newXScale, "main");}
    
            zoomGraph.bg(refs.newProps, newXScale, "mainGraphBG");
            zoomGraph.jetzt(refs.newProps, newXScale);
            zoomGraph.xAxis(refs.newProps, newXScale, "main");
        }
    },[])

    const brushIt = useCallback(()=>{
        if(mutableRefs.current.newProps.firstSet && mutableRefs.current.brushState !== null && mutableRefs.current.isDrawed){
            mutableRefs.current.newProps.state.selections.mainGraph.call(
                zoomObjRefs.current.zoom.transform, 
                    d3_zoom.zoomIdentity
                        .scale(mutableRefs.current.brushState.k)
                        .translate(mutableRefs.current.brushState.x, 0)
            );
        }
    },[])

    const setSelections = useCallback(()=>{
        mutableRefs.current.newProps.setState({
            ...mutableRefs.current.newProps.state,
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

        svgDef.set(defs, mutableRefs.current.newProps);

        const mainGraph = svg.append("g").attr("id", "mainGraph")
            .attr('transform', `translate(${ mutableRefs.current.newProps.state.graph.x},${ mutableRefs.current.newProps.state.graph.y})`)
            .attr("opacity", 1)

        const mainGraphBG = mainGraph.append("g").attr("id", "mainGraphBG")

        const navGroup = nav.append("g").attr("id", "navGroup")
            .attr('transform', `translate(${ mutableRefs.current.newProps.state.navigation.x},${0})`)

        linesPatterns.graphBackground(mainGraphBG, mutableRefs.current.newProps, "graph", false)
        linesPatterns.frame(mainGraph, mutableRefs.current.newProps)
        misc.jetzt(mutableRefs.current.newProps, mainGraph, "main")

        // wahlen
        misc.huerde(mutableRefs.current.newProps, mainGraph)
        curves.parteien(mainGraph, mutableRefs.current.newProps, d3Refs.linePartei)

        // achsen
        axis.x(mutableRefs.current.newProps, mainGraph, "main")
        axis.y(mutableRefs.current.newProps, mainGraph)
        // label
        label.yAxis(mutableRefs.current.newProps, mainGraph, "wahlen")
        // context
        navigation.context(mutableRefs.current.newProps, navGroup, zoomObjRefs.current.brush)

        const periodenGroup = mainGraph.append("g").attr("class", "periodenGroup")
            .attr("opacity", refs.newProps.mutables.handle_perioden ? 1 : 0)
        const wahlenGroup = mainGraph.append("g").attr("class", "wahlenGroup")
            .attr("opacity", refs.newProps.mutables.handle_wahlen ? 1 : 0)

        linesPatterns.highlightLine(mutableRefs.current.newProps, periodenGroup, "perioden");
        linesPatterns.highlightLine(mutableRefs.current.newProps, wahlenGroup, "wahlen")

        highlighter.recGraph(mutableRefs.current.newProps, mainGraph, "main")

        mainGraph.call(zoomObjRefs.current.zoom)
            .on("wheel.zoom", null)
            //.on("dblclick.zoom", null);

        zoomHelper.initZoom(mainGraph, zoomObjRefs.current.zoom, mutableRefs.current.newProps.zoomInfo, mutableRefs.current.newProps)

    },[])

    const removeElAndNewZoom = useCallback(()=>{
        zoomObjRefs.current.zoom = d3Zoom.zoom(mutableRefs.current.newProps, setZoomState, setZOOMINFO)
        zoomObjRefs.current.brush = d3Zoom.brush(mutableRefs.current.newProps, setBrushState)
        d3Refs.current.linePartei = lines.curve(mutableRefs.current.newProps, "partei")
        mutableRefs.current.newProps.state.selections.container.select("defs").remove()
        mutableRefs.current.newProps.state.selections.container.select("#mainGraph").remove()
        mutableRefs.current.newProps.state.selections.navContainer.select("#navGroup").remove()
    },[])

    const handleMouse = useCallback(()=>{

        if(mutableRefs.current.newProps.firstSet && mutableRefs.current.isDrawed){

            const { mouseEvents : mouse } = mutableRefs.current.newProps
            const { highlight } = mutableRefs.current.newProps

            const same = check.sameHighlight (mutableRefs.current.newProps, mouse.type, mouse.key)
            const isPeriod = mouse.type === "perioden"
            const wasPeriod = highlight.ident === "perioden"

            if(mouse.mouseEvent === "enter") {
                handleEvents.toggle(mutableRefs.current.newProps, true, "new", mouse.mouseEvent); 
                handleEvents.showTooltip(mutableRefs.current.newProps)}
            else if(mouse.mouseEvent === "leave") { 
                if((!highlight.highlight_main && !same) || (!highlight.highlight_main && same)){
                    deleteTooltip(); 
                    handleEvents.toggle(mutableRefs.current.newProps, false, "new", mouse.mouseEvent); 
                }
                else if(highlight.highlight_main && !same){
                    deleteTooltip(); 
                    handleEvents.toggle(mutableRefs.current.newProps, false, "new", mouse.mouseEvent); 
                }
            }

            else if(mouse.mouseEvent === "click") {
                deleteTooltip();
                // highlight switch
                if (highlight.highlight_main && !same){
                    if((isPeriod && wasPeriod)){
                        handleEvents.toggle(mutableRefs.current.newProps, true, "new", mouse.mouseEvent)
                    }
                    else {
                        handleEvents.toggle(mutableRefs.current.newProps, false, "switch", mouse.mouseEvent)
                        handleEvents.toggle(mutableRefs.current.newProps, true, "new", mouse.mouseEvent)
                    }
                }
                // highlight off
                else if(highlight.highlight_main && same){
                    handleEvents.toggle(mutableRefs.current.newProps, false, "switch", mouse.mouseEvent)
                }
                // highlight new
                else if(!highlight.highlight_main){
                    handleEvents.toggle(mutableRefs.current.newProps, true, "new", mouse.mouseEvent)
                }

                const setType = (highlight.highlight_main && same) ? 
                    "KILL_HIGHLIGHT_MAIN" : "HIGHLIGHT_MAIN";

                mutableRefs.current.newProps.setHIGHLIGHT({
                    type : setType,
                    infos :  mutableRefs.current.newProps.state.data[mouse.dataSet],
                    key : mouse.key,
                    ident : mouse.type,
                    element : calc.getElement(mutableRefs.current.newProps.state.data[mouse.dataSet], mouse.keyName, mouse.key)
                })

                switch(mouse.type){
                    case "partei":
                        mutableRefs.current.newProps.setPARTEI({
                            type : "PARTEI_HIGHLIGHT",
                            highlight : highlight,
                            partei : mouse.key,
                        });
                        break;
                    default :
                        break;
                }
                if(highlight.ident === "partei" && mouse.type !== "partei" ){
                    mutableRefs.current.newProps.setPARTEI({ type : "KILL_HIGHLIGHT_PARTEI" });
                }
            }
        }   
    },[])

    // Effects:

    // SET:

    useEffect(()=>{ 
        if(mutableRefs.current.newProps.firstSet && !mutableRefs.current.isDrawed) {
            drawIt()
            setSelections()
            drawed(true)
        }; 
    }, [drawIt, setSelections])

    // RESIZE:

    useEffect(()=>{ 
        if(mutableRefs.current.newProps.firstSet && mutableRefs.current.newProps.state.selectionsSet && mutableRefs.current.isDrawed) {
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
        if(mutableRefs.current.newProps.firstSet && mutableRefs.current.isDrawed){
            zoomGraph.perioden(mutableRefs.current.newProps, mutableRefs.current.newProps.zoomInfo.zoomScale)
            toggle.handles(mutableRefs.current.newProps, "perioden", props.mutables.handle_perioden)
        }
    }, [props.mutables.handle_perioden])
    useEffect(()=>{ 
        if(mutableRefs.current.newProps.firstSet && mutableRefs.current.isDrawed){
            zoomGraph.highlightLines(mutableRefs.current.newProps, mutableRefs.current.newProps.zoomInfo.zoomScale, "wahlen")
            toggle.handles(mutableRefs.current.newProps, "wahlen", props.mutables.handle_wahlen)
        }
    }, [props.mutables.handle_wahlen])
    useEffect(()=>{ 
        if(mutableRefs.current.newProps.firstSet && mutableRefs.current.isDrawed){
            toggle.label(mutableRefs.current.newProps); 
        }
    }, [props.mutables.labelPartei])

    useEffect(()=>{
        handleMouse()
    }, [mouseEvents.e, handleMouse])

    useEffect(()=>{ 
        if(mutableRefs.current.newProps.firstSet && mutableRefs.current.isDrawed) {
            toggle.curves(mutableRefs.current.newProps); 
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
                <ZoomMenu {...newProps}/>
                <PeriodeSelect {...props}/>
            </div>
        </div>
    )
}

