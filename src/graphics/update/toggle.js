import * as d3_select from 'd3-selection';

import * as check from  '../../helper/check.js';

export function handles({ state }, type, active){
    const t = state.transition
    switch(type){
        case "events" : 
            state.selections.events.transition(t).attr("opacity", active ? 1 : 0);
            state.selections.periodenHL.selectAll("rect").style("pointer-events", active ? "auto" : "none");
            break;
        case "persons" :
            state.selections.wahlen.transition(t).attr("opacity", active ? 1 : 0);
            state.selections.wahlen.selectAll("path")
                .style("pointer-events", active ? "auto" : "none")
                .attr("cursor", active ? "pointer" : "none");
            break;
        default: break;
    }
}

export function label({ state, infoElements}){
    const t = state.transition;
    state.selections.parteiLabel
        .transition(t)
        .attr("opacity", infoElements.labelPartei ? state.textOpacity.active : 0)
}

export function highlighterNAV({ state }, d, mode, type) {

    const t = state.transition;

    let end = null;
    switch(type){
        case "perioden" : end = "end"; break;
        case "regOber" : end = "stopp"; break;
        default: break;
    }

    const coords = {
        x: state.x_scale(d.start),
        width : state.x_scale(d.end) - state.x_scale(d.start)
    }

    state.selections.navHL.select("#rect")
        .transition(t)
        .attr("x", coords.x)
        .attr("width", coords.width)
        .attr("opacity", mode ? 0.75 : 0)
    state.selections.navHL.select("#left")
        .transition(t)
        .attr("opacity", mode ? 1 : 0)
        .attr("x1", coords.x)
        .attr("x2", coords.x)
    state.selections.navHL.select("#right")
        .transition(t)
        .attr("opacity", mode ? 1 : 0)
        .attr("x1", coords.x + coords.width)
        .attr("x2", coords.x + coords.width)
        
}

export function highlighter({ state, zoomInfo }, d, mode, type) {

    const t = state.transition;
    const coords = {
        x: zoomInfo.scaleX(d.start),
        width : zoomInfo.scaleX(d.end) - zoomInfo.scaleX(d.start)
    }

    state.selections[type + "HL"].select("#rect")
        .transition(t)
        .attr("x", coords.x)
        .attr("width", coords.width)
        .attr("opacity", mode ? 0.75 : 0)
    state.selections[type + "HL"].select("#left")
        .transition(t)
        .attr("opacity", mode ? 1 : 0)
        .attr("x1", coords.x)
        .attr("x2", coords.x)
    state.selections[type + "HL"].select("#right")
        .transition(t)
        .attr("opacity", mode ? 1 : 0)
        .attr("x1", coords.x + coords.width)
        .attr("x2", coords.x + coords.width)
}