import * as check from  '../../helper/check.js';
import * as call from  '../../helper/events/call.js';

export function draw (stateRefs, graph){

    // const events = call.events(type, key, props)
    // const behaviour = call.behaviour(true);

    console.log(stateRefs)

    const clipGroup = graph.append("g")
        .attr("id", "clipGroupMain")
        .attr("clip-path", "url(#clipPath_main)")

    const bars = clipGroup.append("g")
        .attr("id", "kaiserBars")

    bars.selectAll("rect")
            .data(stateRefs.state.data.kaiser, d => d.id)
                .enter()
                .append("rect")
                .attr("id", d => d.name + "_bar")
                .attr("opacity", 1)
                .attr("x", d => stateRefs.state.x_scale(new Date(d.start)) )
                .attr("y", d => stateRefs.state.y_scale(d.id + 3))
                .attr("width", function (d) { return stateRefs.state.x_scale(new Date(d.end)) - stateRefs.state.x_scale(new Date(d.start)); })
                .attr("height", stateRefs.state.barHeight)
                .style("fill", function(d){ return d.id === -2 || d.id === 0 ? "url(#hatching)" : "black"})
                // .call(behaviour)
                // .call(events)

    bars.selectAll("text")
            .data(stateRefs.state.data.kaiser, d => d.id)
                .enter()
                .append("text")
                .attr("class", d => "label_" + d.name)
                .attr("clip-path", "url(#clipPath_main)")
                .attr("opacity", 1)
                .attr("x", d => stateRefs.state.x_scale(new Date(d.start)) - 5)
                .attr("y", d => stateRefs.state.y_scale(d.id + 2) - 2)
                .style("fill", "black")
                .text(d=>d.name)
                .attr("text-anchor", "end")
                .style("font-family", "serif")
                .style("font-size", stateRefs.state.barHeight)
                .style("user-select", "none")
                .style("dominant-baseline", "baseline")
                // .call(behaviour)
                // .call(events);

    return bars
    
}