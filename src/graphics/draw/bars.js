import * as check from  '../../helper/check.js';
import * as call from  '../../helper/events/call.js';
//import { getKeyType } from  '../../helper/calc_set.js';

export function parteien (graph, props, line){

    const type = "partei"
    const key = getKeyType(type)
    const events = call.events(type, key, props)
    const behaviour = call.behaviour(true);

    // props.state.data.pathWahlen.forEach((org)=>{
    //     if(check.excludeParteien(org.partei)){
    //         const orgGroup = graph.append("g")
    //             .attr("id", org.partei + "_pathCircleGroup")
    //             .attr("clip-path", "url(#clipPath_main)")

    //         orgGroup.append("g")
    //             .attr("class", "parteiCircles")
    //             .attr("id", org.partei + "_circleGroup")
    //             .selectAll("circle")
    //                 .data(org.ergebnisse.filter(function(d) { return check.nullHundret(d) }))
    //                     .enter()
    //                     .append("circle")
    //                     .attr("class", org.partei + "_circle")
    //                     .attr("opacity", props.parteienState["checked_" + org.partei] ? props.state.circleOpacity.active : props.state.circleOpacity.disabled)
    //                     .attr("cx", function (d) { return props.state.x_scale(new Date(d.Datum)); })
    //                     .attr("cy", function (d) { return props.state.y_scale(d.Ergebnis); })
    //                     .attr("r", props.state.circleRadius)
    //                     .style("fill", org.color)
    //                     .call(behaviour)
    //                     .call(events)
    //         orgGroup.append("path")
    //             .attr("class", "parteiKurven")
    //             .attr("id", org.partei + "_path")
    //                 .datum(org.ergebnisse)
    //                     .attr("fill", "none")
    //                     .attr("opacity", props.parteienState["checked_" + org.partei] ? props.state.pathOpacity.active : props.state.pathOpacity.disabled)
    //                     .attr("stroke", org.color)
    //                     .attr("stroke-width", props.state.graphHighlight.pathIdle)
    //                     .attr("d", line)
    //                     .call(behaviour)
    //                     .call(events)
    //         orgGroup
    //             .selectAll("text")
    //                 .data(org.ergebnisse.filter( (d, i) => { return d !== null && org.firstPoints.includes(i) }))
    //                     .enter()
    //                     .append("text")
    //                     .attr("class", "label_" + org.partei + " parteiLabel")
    //                     .attr("clip-path", "url(#clipPath_main)")
    //                     .attr("opacity", props.infoElements.labelPartei ? props.parteienState["checked_" + org.partei] ? props.state.textOpacity.active : 0.1 : 0)
    //                     .attr("x", d => props.state.x_scale(new Date(d.Datum)) - 5)
    //                     .attr("y", d => props.state.y_scale(d.Ergebnis))
    //                     .style("fill", org.color)
    //                     .text(org.Abkuerzung)
    //                     .attr("text-anchor", "end")
    //                     .style("font-family", "sans-serif")
    //                     .style("font-size", "9pt")
    //                     .style("user-select", "none")
    //                     .style("dominant-baseline", "baseline")
    //                     .call(behaviour)
    //                     .call(events);

    //         orgGroup.append("path")
    //             .attr("class", "parteiKurven_click")
    //             .attr("id", org.partei + "_clickPath")
    //             .attr("clip-path", "url(#clipPath)")
    //             .datum(org.ergebnisse)
    //                 .attr("fill", "none")
    //                 .attr("stroke", "transparent")
    //                 .attr("stroke-width", props.state.graphHighlight.clickPathWidth)
    //                 .attr("d", line)
    //                 .call(behaviour)
    //                 .call(events)
    //}
    //})
}