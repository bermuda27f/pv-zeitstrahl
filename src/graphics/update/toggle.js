import * as d3_select from 'd3-selection';

import * as check from  '../../helper/check.js';

export function curves(props) {

    const t = props.state.transition;

    const opacity = (org) => { return props.parteienState["checked_" + org.partei] ?
        props.state.pathOpacity.active : props.state.pathOpacity.disabled }

    props.state.selections.fuenfProzentX.transition(t)
        .attr("y1", props.state.y_scale(5));
    props.state.selections.fuenfProzentX.transition(t)
        .attr("y2", props.state.y_scale(5));
    props.state.selections.fuenfProzentY.transition(t)
        .attr("y1",props.state.graph.height).attr("opacity", props.state.huerde.opacity);

    props.state.data.pathWahlen.forEach((org) => {
        d3_select.selectAll(".label_" + org.partei)
            .data(org.ergebnisse.filter((d, i) => { return d !== null && org.firstPoints.includes(i) }))
            .transition(t)
                .attr("y", function (d) { return props.state.y_scale(d.Ergebnis)})
                .attr("opacity",  props.mutables.labelPartei ? props.parteienState["checked_" + org.partei] ? 1 : props.state.pathOpacity.disabled : 0)
                .style("pointer-events",  props.mutables.labelPartei ? props.parteienState["checked_" + org.partei] ? "auto" : "none" : "none");
        d3_select.select("#" + org.partei + "_circleGroup").selectAll("circle")
            .data(org.ergebnisse.filter(function(d) { return check.nullHundret(d) }))
            .transition(t)
                .attr("cy", function (d) { return props.state.y_scale(d.Ergebnis)})
                .attr("opacity", opacity(org))
                .style("pointer-events", "auto");
        d3_select.select("#" + org.partei + "_path")
            .datum(org.ergebnisse)
            .transition(t)
                .attr("d", props.state.lines.partei)
                .attr("opacity", opacity(org))
                .style("pointer-events", "auto");
        d3_select.select("#" + org.partei + "_clickPath")
            .datum(org.ergebnisse)
            .transition(t)
                .attr("d", props.state.lines.partei)
                .style("pointer-events", "auto");
    });

}

export function handles(props, type, active){
    const t = props.state.transition
    switch(type){
        case "perioden" : 
            props.state.selections.perioden.transition(t).attr("opacity", active ? 1 : 0);
            props.state.selections.periodenHL.selectAll("rect").style("pointer-events", active ? "auto" : "none");
            break;
        case "wahlen" :
            props.state.selections.wahlen.transition(t).attr("opacity", active ? 1 : 0);
            props.state.selections.wahlen.selectAll("path")
                .style("pointer-events", active ? "auto" : "none")
                .attr("cursor", active ? "pointer" : "none");
            break;
        default: break;
    }
}

export function label(props){
    const t = props.state.transition;
    props.state.selections.parteiLabel
        .transition(t)
        .attr("opacity", props.mutables.labelPartei ? props.state.textOpacity.active : 0)
}

export function highlighterNAV(props, d, mode, type) {

    const t = props.state.transition;

    let end = null;
    switch(type){
        case "perioden" : end = "end"; break;
        case "regOber" : end = "stopp"; break;
        default: break;
    }

    const date_start = new Date(d.start)
    const date_end = new Date(d[end])
    const coords = {
        x: props.state.x_scale(date_start),
        width : props.state.x_scale(date_end) - props.state.x_scale(date_start)
    }

    props.state.selections.navHL.select("#rect")
        .transition(t)
        .attr("x", coords.x)
        .attr("width", coords.width)
        .attr("opacity", mode ? 0.75 : 0)
    props.state.selections.navHL.select("#left")
        .transition(t)
        .attr("opacity", mode ? 1 : 0)
        .attr("x1", coords.x)
        .attr("x2", coords.x)
    props.state.selections.navHL.select("#right")
        .transition(t)
        .attr("opacity", mode ? 1 : 0)
        .attr("x1", coords.x + coords.width)
        .attr("x2", coords.x + coords.width)
        
}

export function highlighter(props, d, mode, type) {

    const t = props.state.transition;
    const date_start = new Date(d.start);
    const date_end = new Date(d.end);
    const coords = {
        x: props.zoomInfo.zoomScale(date_start),
        width : props.zoomInfo.zoomScale(date_end) - props.zoomInfo.zoomScale(date_start)
    }

    props.state.selections[type + "HL"].select("#rect")
        .transition(t)
        .attr("x", coords.x)
        .attr("width", coords.width)
        .attr("opacity", mode ? 0.75 : 0)
    props.state.selections[type + "HL"].select("#left")
        .transition(t)
        .attr("opacity", mode ? 1 : 0)
        .attr("x1", coords.x)
        .attr("x2", coords.x)
    props.state.selections[type + "HL"].select("#right")
        .transition(t)
        .attr("opacity", mode ? 1 : 0)
        .attr("x1", coords.x + coords.width)
        .attr("x2", coords.x + coords.width)
        
}