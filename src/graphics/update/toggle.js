import * as d3_select from 'd3-selection';

import * as check from  '../../helper/check.js';

export function curves({ state, mutables, parteienState}) {

    const t = state.transition;

    const opacity = (org) => { return parteienState["checked_" + org.partei] ?
        state.pathOpacity.active : state.pathOpacity.disabled }

    state.selections.fuenfProzentX.transition(t)
        .attr("y1", state.y_scale(5));
    state.selections.fuenfProzentX.transition(t)
        .attr("y2", state.y_scale(5));
    state.selections.fuenfProzentY.transition(t)
        .attr("y1", state.graph.height).attr("opacity", state.huerde.opacity);

    state.data.pathWahlen.forEach((org) => {
        d3_select.selectAll(".label_" + org.partei)
            .data(org.ergebnisse.filter((d, i) => { return d !== null && org.firstPoints.includes(i) }))
            .transition(t)
                .attr("y", function (d) { return state.y_scale(d.Ergebnis)})
                .attr("opacity",  mutables.labelPartei ? parteienState["checked_" + org.partei] ? 1 : state.pathOpacity.disabled : 0)
                .style("pointer-events", mutables.labelPartei ? parteienState["checked_" + org.partei] ? "auto" : "none" : "none");
        d3_select.select("#" + org.partei + "_circleGroup").selectAll("circle")
            .data(org.ergebnisse.filter(function(d) { return check.nullHundret(d) }))
            .transition(t)
                .attr("cy", function (d) { return state.y_scale(d.Ergebnis)})
                .attr("opacity", opacity(org))
                .style("pointer-events", "auto");
        d3_select.select("#" + org.partei + "_path")
            .datum(org.ergebnisse)
            .transition(t)
                .attr("d", state.lines.partei)
                .attr("opacity", opacity(org))
                .style("pointer-events", "auto");
        d3_select.select("#" + org.partei + "_clickPath")
            .datum(org.ergebnisse)
            .transition(t)
                .attr("d", state.lines.partei)
                .style("pointer-events", "auto");
    });

}

export function handles({ state }, type, active){
    const t = state.transition
    switch(type){
        case "perioden" : 
            state.selections.perioden.transition(t).attr("opacity", active ? 1 : 0);
            state.selections.periodenHL.selectAll("rect").style("pointer-events", active ? "auto" : "none");
            break;
        case "wahlen" :
            state.selections.wahlen.transition(t).attr("opacity", active ? 1 : 0);
            state.selections.wahlen.selectAll("path")
                .style("pointer-events", active ? "auto" : "none")
                .attr("cursor", active ? "pointer" : "none");
            break;
        default: break;
    }
}

export function label({ state, mutables}){
    const t = state.transition;
    state.selections.parteiLabel
        .transition(t)
        .attr("opacity", mutables.labelPartei ? state.textOpacity.active : 0)
}

export function highlighterNAV({ state }, d, mode, type) {

    const t = state.transition;

    let end = null;
    switch(type){
        case "perioden" : end = "end"; break;
        case "regOber" : end = "stopp"; break;
        default: break;
    }

    const date_start = new Date(d.start)
    const date_end = new Date(d[end])
    const coords = {
        x: state.x_scale(date_start),
        width : state.x_scale(date_end) - state.x_scale(date_start)
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
    const date_start = new Date(d.start);
    const date_end = new Date(d.end);
    const coords = {
        x: zoomInfo.scale(date_start),
        width : zoomInfo.scale(date_end) - zoomInfo.scale(date_start)
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