import * as check from  '../../helper/check.js';
import * as call from  '../../helper/events/call.js';
import * as d3_select from 'd3-selection';

export function draw (stateRefs, graph){

    const { state } = stateRefs

    const events = call.events("person", "id", stateRefs)
    const behaviour = call.behaviour(true);

    const clipGroup = graph.append("g")
        .attr("clip-path", "url(#clipPath_main)")
        .attr("id", "clipGroupMain")
        
    const bars = clipGroup.append("g")
        .attr("id", "kaiserBars")

    bars.selectAll("rect")
        .data(state.data.kaiser, d => d.id )
            .enter()
            .each(function(d,i){
                const selection = d3_select.select(this)
                if(d.born !== null ){
                    selection
                        .append("rect")
                        .attr("id", d => d.name + "_lifetime_bar")
                        .attr("class", "lifetimebar")
                        .attr("opacity", 1)
                        .attr("x", d => state.x_scale(d.born) )
                        .attr("y", d => state.y_scale(d.id + 3))
                        .attr("width", function (d) { return state.x_scale(d.died) - state.x_scale(d.born); })
                        .attr("stroke", "black")
                        .attr("stroke-width", state.lineWidth)
                        .attr("height", state.barHeight)
                        .style("fill", "url(#circlePattern)")
                        .call(behaviour)
                        .call(events);
                }
                selection
                    .append("rect")
                    .attr("id", d => d.name + "_bar")
                    .attr("opacity", 1)
                    .attr("x", d => state.x_scale(d.start) )
                    .attr("y", d => state.y_scale(d.id + 3))
                    .attr("width", function (d) { return state.x_scale(d.end) - state.x_scale(d.start); })
                    .attr("height", state.barHeight)
                    .style("fill", function(d){ return d.id === -2 || d.id === 0 ? "url(#hatching)" : "black"})
                    .call(behaviour)
                    .call(events)

                selection
                    .append("text")
                    .attr("class", d => "label_" + d.name)
                    .attr("opacity", 1)
                    .attr("x", d => state.x_scale(d.id === -2 || d.id === 0 ? d.start : d.born) - 5 )
                    .attr("y", d => state.y_scale(d.id + 2) - 2)
                    .style("fill", "black")
                    .text(d=>d.name)
                    .attr("text-anchor", "end")
                    .style("font-family", "serif")
                    .style("font-size", state.barHeight)
                    .style("user-select", "none")
                    .style("dominant-baseline", "baseline")
                    // .call(behaviour)
                    // .call(events);

                selection
                    .append("line")
                    .attr("class", d => "kaiser_lines")
                    .attr("x1", 0)
                    .attr("y1", (d,i) => state.y_scale(d.id + 3))
                    .attr("x2", state.width)
                    .attr("y2", (d,i) => state.y_scale(d.id + 3))
                    .attr("stroke-width", state.lineWidth)
                    .attr("opacity", 0.5)
                    .attr("stroke", "grey");
            })

    const zoomRect = graph.append("rect")
        .attr("fill", "transparent")
        .attr("width", state.width)
        .attr("height", state.height)

    return bars
    
}