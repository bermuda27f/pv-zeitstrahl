import * as handleEvents from  '../events/events.js';
import * as zoomGraph from  '../../graphics/update/zoom.js';
import * as d3_zoom from 'd3-zoom';
import * as d3_select from 'd3-selection';
import * as linesPatterns from '../../graphics/draw/patternsLines.js';
import * as svgDef from '../../graphics/draw/defs.js';
import * as misc from  '../../graphics/draw/misc.js';
import * as curves from  '../../graphics/draw/bars.js';
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
        if(stateRefs.highlight.ident === "partei") stateRefs.setPARTEI({ type: "KILL_HIGHLIGHT_PARTEI"})
        handleEvents.toggle(stateRefs, false, "switch", "click")
    }
};

export function zoomIt(stateRefs, zoomObjRefs){
    if(stateRefs.firstSet && stateRefs.isDrawed) {
        const newXScale = stateRefs.zoomState.rescaleX(stateRefs.state.x_scale);
        const range = newXScale.range().map(stateRefs.zoomState.invertX, stateRefs.zoomState);

        stateRefs.state.selections.context.call(zoomObjRefs.current.brush.move, range);
        zoomGraph.curves(stateRefs, newXScale); 

        if(stateRefs.infoElements.handle_perioden) zoomGraph.perioden(stateRefs, newXScale)
        if(stateRefs.infoElements.handle_wahlen) zoomGraph.highlightLines(stateRefs, newXScale, "wahlen")
        
        if(stateRefs.highlight.ident === "perioden"){ zoomGraph.highlights(stateRefs, newXScale, "main");}

        zoomGraph.bg(stateRefs, newXScale, "mainGraphBG");
        zoomGraph.jetzt(stateRefs, newXScale);
        zoomGraph.xAxis(stateRefs, newXScale, "main");
    }
};

export function setSelections(stateRefs, zoomObjRefs, d3Refs, svg_ref, nav_ref){
    stateRefs.setState({
        ...stateRefs.state,
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
};

export function drawIt(svg_ref, nav_ref, stateRefs, d3Refs, zoomObjRefs){

    const svg = d3_select.select(svg_ref.current)
    const nav = d3_select.select(nav_ref.current)

    const defs = svg.append("defs").attr("id", "graphDefs");

    svgDef.set(defs, stateRefs);

    const mainGraph = svg.append("g").attr("id", "mainGraph")
        .attr('transform', `translate(${ stateRefs.state.graph.x},${ stateRefs.state.graph.y})`)
        .attr("opacity", 1)

    const mainGraphBG = mainGraph.append("g").attr("id", "mainGraphBG")

    const navGroup = nav.append("g").attr("id", "navGroup")
        .attr('transform', `translate(${ stateRefs.state.navigation.x},${0})`)

    linesPatterns.graphBackground(mainGraphBG, stateRefs, "graph", false)
    linesPatterns.frame(mainGraph, stateRefs)
    misc.jetzt(stateRefs, mainGraph, "main")

    // wahlen
    misc.huerde(stateRefs, mainGraph)
    curves.parteien(mainGraph, stateRefs, d3Refs.linePartei)

    // achsen
    axis.x(stateRefs, mainGraph, "main")
    axis.y(stateRefs, mainGraph)
    // label
    label.yAxis(mainGraph, "wahlen")
    // context
    navigation.context(stateRefs, navGroup, zoomObjRefs.current.brush)

    const periodenGroup = mainGraph.append("g").attr("class", "periodenGroup")
        .attr("opacity", stateRefs.infoElements.handle_perioden ? 1 : 0)
    const wahlenGroup = mainGraph.append("g").attr("class", "wahlenGroup")
        .attr("opacity", stateRefs.infoElements.handle_wahlen ? 1 : 0)

    linesPatterns.highlightLine(stateRefs, periodenGroup, "perioden");
    linesPatterns.highlightLine(stateRefs, wahlenGroup, "wahlen")

    highlighter.recGraph(stateRefs, mainGraph, "main")

    mainGraph.call(zoomObjRefs.current.zoom)
        .on("wheel.zoom", null)
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

            switch(mouse.type){
                case "partei":
                    stateRefs.setPARTEI({
                        type : "PARTEI_HIGHLIGHT",
                        highlight : highlight,
                        partei : mouse.key,
                    });
                    break;
                default :
                    break;
            }
            if(highlight.ident === "partei" && mouse.type !== "partei" ){
                stateRefs.setPARTEI({ type : "KILL_HIGHLIGHT_PARTEI" });
            }
        }
    }   
};
