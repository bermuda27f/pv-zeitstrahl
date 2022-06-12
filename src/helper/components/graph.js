import * as handleEvents from  '../events/events.js';
import * as zoomGraph from  '../../graphics/update/zoom.js';
import * as d3_zoom from 'd3-zoom';
import * as d3_select from 'd3-selection';
import * as linesPatterns from '../../graphics/draw/patternsLines.js';
import * as svgDef from '../../graphics/draw/defs.js';
import * as misc from  '../../graphics/draw/misc.js';
import * as bars from  '../../graphics/draw/bars.js';
import * as highlighter from  '../../graphics/draw/highlighter.js';
import * as axis from  '../../graphics/draw/axis.js';
import * as label from  '../../graphics/draw/label.js';
import * as navigation from  '../../graphics/draw/navigation.js';
import * as zoomHelper from  '../../helper/zoom.js';
import * as check from  '../check.js';
import * as calc from  '../calc_set.js';

import { deleteTooltip } from '../../graphics/draw/toolTips.js';

export function killSwitch(stateRefs){
        
    if(stateRefs.highlight && stateRefs.firstSet && stateRefs.isDrawed){
        stateRefs.setHIGHLIGHT({ type : "KILL_HIGHLIGHT_MAIN" })
        handleEvents.toggle(stateRefs, false, "switch", "click")
    }
};

export function zoomIt(stateRefs, zoomObjRefs){
    if(stateRefs.firstSet && stateRefs.isDrawed) {

        const newXScale = stateRefs.zoomState.rescaleX(stateRefs.state.x_scale);
        const newYScale = stateRefs.zoomState.rescaleY(stateRefs.state.y_scale);

        const range = newXScale.range().map(stateRefs.zoomState.invertX, stateRefs.zoomState);

        // stateRefs.state.selections.context.call(zoomObjRefs.current.brush.move, range);
        zoomGraph.xAxis(stateRefs, newXScale, "main");

        zoomGraph.bars(stateRefs, newXScale, newYScale); 

        //if(stateRefs.infoElements.handle_wahlen) (stateRefs, newXScale, "wahlen")
        
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
            mainGraph : d3_select.select("#mainGraph"),
            bars : d3_select.select("#kaiserBars"),
            zero : d3_select.select("#zero").select("line"),
            // zoom / context
            focus : d3_select.select(".focus"),
            // ereignisse
            ereignisse : d3_select.selectAll(".ereignisseGroup"), 
            ereignisseSymbol : d3_select.selectAll(".ereignisseSymbol"),
            // label
            label : d3_select.selectAll(".parteiLabel"),
            // X-Achsen:
            xAxis : d3_select.selectAll(".xAxis"),
            xAxisLines : d3_select.selectAll(".xAxisLines"),
            // Y-Lines
            y_lines : d3_select.selectAll("#lines_t"),
            // Highlighter
            mainHL : d3_select.select("#BarHighLight_main"),
        },
        selectionsSet : true
    })
};

export function drawIt(svg_ref, stateRefs, zoomObjRefs){

    const svg = d3_select.select(svg_ref.current)

    const defs = svg.append("defs").attr("id", "graphDefs");

    svgDef.set(defs, stateRefs);

    const mainGraph = svg.append("g").attr("id", "mainGraph")
        .attr('transform', `translate(${ stateRefs.state.graph.x},${ stateRefs.state.graph.y})`)
        .attr("opacity", 1)

    linesPatterns.frame(mainGraph, stateRefs)
    misc.lines(stateRefs, mainGraph)
    misc.zero(stateRefs, mainGraph)

    const barSelection = bars.draw(stateRefs, mainGraph)
    misc.map(stateRefs, barSelection, mainGraph)
    // achsen
    axis.x(stateRefs, mainGraph, "main")
    // label
    // context
    //navigation.context(stateRefs)

    //linesPatterns.highlightLine(stateRefs, wahlenGroup, "wahlen")
    //highlighter.recGraph(stateRefs, mainGraph, "main")

    mainGraph.call(zoomObjRefs.current.zoom)
        //.on("wheel.zoom", null)
        //.on("dblclick.zoom", null);

    zoomHelper.initZoom(mainGraph, zoomObjRefs.current.zoom, stateRefs)

};

export function handleMouse(stateRefs){

    if(stateRefs.firstSet && stateRefs.isDrawed){

        const { mouseEvents : mouse, highlight } = stateRefs

        const same = check.sameHighlight (stateRefs, mouse.type, mouse.key)
        const isPeriod = mouse.type === "perioden"
        const wasPeriod = highlight.ident === "perioden"

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
                if((isPeriod && wasPeriod)){
                    handleEvents.toggle(stateRefs, true, "new", mouse.mouseEvent)
                }
                else {
                    handleEvents.toggle(stateRefs, false, "switch", mouse.mouseEvent)
                    handleEvents.toggle(stateRefs, true, "new", mouse.mouseEvent)
                }
            }
            // highlight off
            else if(highlight.highlight_main && same){
                handleEvents.toggle(stateRefs, false, "switch", mouse.mouseEvent)
            }
            // highlight new
            else if(!highlight.highlight_main){
                handleEvents.toggle(stateRefs, true, "new", mouse.mouseEvent)
            }

            const setType = (highlight.highlight_main && same) ? 
                "KILL_HIGHLIGHT_MAIN" : "HIGHLIGHT_MAIN";

            stateRefs.setHIGHLIGHT({
                type : setType,
                infos :  stateRefs.state.data[mouse.dataSet],
                key : mouse.key,
                ident : mouse.type,
                element : calc.getElement(stateRefs.state.data[mouse.dataSet], mouse.keyName, mouse.key)
            })

        }
    }   
};
