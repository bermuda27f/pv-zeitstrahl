import * as handleEvents from  '../events/events.js';
import * as zoomGraph from  '../../graphics/update/zoom.js';
import * as d3_zoom from 'd3-zoom';
import * as d3_select from 'd3-selection';
import * as svgDef from '../../graphics/draw/defs.js';
import * as misc from  '../../graphics/draw/misc.js';
import * as bars from  '../../graphics/draw/bars.js';
import * as events from  '../../graphics/draw/events.js';
import * as axis from  '../../graphics/draw/axis.js';

import * as label from  '../../graphics/draw/label.js';
import * as zoomHelper from  '../../helper/zoom.js';
import * as check from  '../check.js';
import * as calc from  '../calc_set.js';

import { deleteTooltip } from '../../graphics/draw/tooltips.js';
import { highlight } from '../reducer.js';

export function killSwitch(stateRefs){
        
    if(stateRefs.highlight && stateRefs.firstSet && stateRefs.isDrawed){
        stateRefs.setHIGHLIGHT({ type : "KILL_HIGHLIGHT_MAIN" })
        handleEvents.toggle(stateRefs, false, "switch", "click")
    }
};

export function zoomIt(stateRefs){
    if(stateRefs.firstSet && stateRefs.isDrawed && stateRefs.zoomInfo.scaleY) {

        zoomGraph.graph(stateRefs, stateRefs.zoomState); 
        zoomGraph.xAxis(stateRefs, stateRefs.zoomInfo.scaleX, "main");

    }
};

export function setSelections(stateRefs, zoomObjRefs, svg_ref){
    stateRefs.setState({
        ...stateRefs.state,
        zoomObject : zoomObjRefs.current.zoom,
        selections : {
            // zoom
            container : d3_select.select(svg_ref.current),
            // main
            zoomGroup : d3_select.select("#zoomGroup"),
            mainGraph : d3_select.select("#mainGraph"),
            bars : d3_select.select("#kaiserBars"),
            events : d3_select.select("#eventGroup"),
            zero : d3_select.select("#zero"),
            focus : d3_select.select("#_focus"),
            map : d3_select.select("#mapGroup"),

            // ereignisse
            ereignisseSymbol : d3_select.selectAll(".ereignisseSymbol"),
            // label
            // X-Achsen:
            axisGroup : d3_select.selectAll("#axisGroup"),
            xAxis : d3_select.selectAll(".xAxis"),
            xAxisLines : d3_select.selectAll(".xAxisLines"),
            // Highlight
            personHL : d3_select.select("#BarHighlight"),
        },
        selectionsSet : true
    })
};

export function drawIt(svg_ref, stateRefs, zoomObjRefs){

    const svg = d3_select.select(svg_ref.current)
    const defs = svg.append("defs").attr("id", "graphDefs");

    svgDef.set(defs, stateRefs);

    const zoomGroup = svg.append("g").attr("id", "zoomGroup")
        .attr("clip-path", "url(#clipPath_main)")
    const eventGroup = svg.append("g").attr("id", "eventGroup")
        .attr('transform', `translate(${ stateRefs.state.graph.x},${ stateRefs.state.graph.y})`)
    const mainGraph = zoomGroup.append("g").attr("id", "mainGraph")
        .attr('transform', `translate(${ stateRefs.state.graph.x},${ stateRefs.state.graph.y})`)
        .attr("opacity", 1);
    const axisContainer = svg.append("g").attr("id", "axisGroup")
        .attr("transform", `translate(${stateRefs.state.graph.x}, ${stateRefs.state.graph.y})`)
    const map = svg.append("g").attr("id", "mapGroup")
        .attr('transform', `translate(${ stateRefs.state.graph.x},${ stateRefs.state.graph.y})`)

    misc.frame(mainGraph, stateRefs)
    misc.highlight(stateRefs, mainGraph)
    axis.x(stateRefs, axisContainer, "main")
    label.x_axis(stateRefs, axisContainer)
    const barSelection = bars.draw(stateRefs, mainGraph)
    events.set(stateRefs, eventGroup, stateRefs.state.x_scale)
    misc.zero(stateRefs, mainGraph, false)
    misc.map(stateRefs, barSelection, map)

    zoomGroup.call(zoomObjRefs.current.zoom)
        .on("wheel.zoom", null)
        //.on("dblclick.zoom", null);

};

export function handleMouse(stateRefs){

    if(stateRefs.firstSet && stateRefs.isDrawed){

        const { mouseEvents : mouse, highlight } = stateRefs

        const same = check.sameHighlight (stateRefs, mouse.type, mouse.key)

        if(mouse.mouseEvent === "enter") {
            handleEvents.toggle(stateRefs, true, "new", mouse.mouseEvent); 
            handleEvents.showTooltip(stateRefs)}
        else if(mouse.mouseEvent === "leave") { 
            if((!highlight.highlight_main && !same) || (!highlight.highlight_main && same)){
                deleteTooltip(); 
                handleEvents.toggle(stateRefs, false, "new", mouse.mouseEvent); 
            }
            else if(highlight.highlight_main && !same){
                deleteTooltip(); 
                handleEvents.toggle(stateRefs, false, "new", mouse.mouseEvent); 
            }
        }

        else if(mouse.mouseEvent === "click") {
            deleteTooltip();
            // highlight switch
            if (highlight.highlight_main && !same){
                handleEvents.toggle(stateRefs, false, "switch", mouse.mouseEvent)
                handleEvents.toggle(stateRefs, true, "new", mouse.mouseEvent)
                handleEvents.setOrder(stateRefs, mouse.key)
            }
            // highlight off
            else if(highlight.highlight_main && same){
                handleEvents.toggle(stateRefs, false, "switch", mouse.mouseEvent)
            }
            // highlight new
            else if(!highlight.highlight_main){
                handleEvents.toggle(stateRefs, true, "new", mouse.mouseEvent)
                handleEvents.setOrder(stateRefs, mouse.key)
            }

            const setType = (highlight.highlight_main && same) ? 
                "KILL_HIGHLIGHT_MAIN" : "HIGHLIGHT_MAIN";

            stateRefs.setHIGHLIGHT({
                type : setType,
                infos :  stateRefs.state.data[mouse.dataSet],
                key : mouse.key,
                ident : mouse.type,
                element : calc.getElement(stateRefs.state.data[mouse.dataSet], "id", mouse.key)
            })

        }
    }   
};
