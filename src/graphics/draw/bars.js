import * as check from  '../../helper/check.js';
import * as calc from '../../helper/calc_set.js'
import * as call from  '../../helper/events/call.js';

import * as d3_select from 'd3-selection';
import * as d3_array from 'd3-array';
import * as d3_zoom from 'd3-zoom';

export function draw (stateRefs, container){

    const { state, infoElements } = stateRefs

    const events = call.events("persons", "id", stateRefs)
    const behaviour = call.behaviour(true);
        
    const bars = container.append("g")
        .attr("id", "kaiserBars")

    // Text-Width Calculation WIP!
    //const widthArray = []

    bars.selectAll("rect")
        .data(state.data.persons, d => d.id )
        .join(
            enter => {
                const selection = enter.append("g")
                    .attr("id", d => "barG_" + d.id)
                selection
                    .append("rect")
                    .attr("id", d => d.name + "_lifetime_bar")
                    .attr("class", "lifetimebar")
                    .attr("opacity", 1)
                    .attr("x", d => state.x_scale(new Date(d.start)) )
                    .attr("y", d => state.y_scale(d.id))
                    .attr("width", d => calc.barWidth(state, d.start, d.end))
                    .attr("stroke", "black")
                    .attr("stroke-width", state.lineWidth)
                    .attr("height", state.barHeight)
                    .style("fill", "url(#circlePattern)")
                    .call(behaviour)
                    .call(events);
                selection
                    .append("rect")
                    .attr("id", d => d.name + "_bar")
                    .attr("opacity", 1)
                    .attr("x", d => state.x_scale(new Date(d.focus_start)) )
                    .attr("y", d => state.y_scale(d.id))
                    .attr("width", d => calc.barWidth(state, d.focus_start, d.focus_end))
                    .attr("height", state.barHeight)
                    .style("fill", function(d){ return d.id === 1 || d.id === 3 ? "url(#hatching)" : "black"})
                    .attr("stroke-width", state.lineWidth)
                    .style("stroke", "black")
                    .call(events)
                    .call(behaviour);

                selection
                    .append("text")
                    .attr("class", "person_label")
                    .attr("id", d => "person_label_" + d.id)
                    .attr("opacity", infoElements.label ? 1 : 0)
                    .attr("x", d => state.x_scale(new Date(d.start)) - state.textOffset)
                    .attr("y", d => state.y_scale(d.id - 1) - 1)
                    .style("fill", "black")
                    .text(d => d.name)
                    .attr("text-anchor", "end")
                    .style("font-family", "serif")
                    .style("font-size", state.barHeight)
                    .style("user-select", "none")
                    .style("dominant-baseline", "baseline")
                    // .each(function(d, i) { 
                    //     const x = state.x_scale(new Date(d.start)) - this.getBBox().width
                    //     widthArray.push({x : x, date : d.start, bbox : this.getBBox().width}) 
                    // })

                selection
                    .append("line")
                    .attr("class", d => "kaiser_lines")
                    .attr("x1", 0)
                    .attr("y1", (d,i) => state.y_scale(d.id))
                    .attr("x2", state.width)
                    .attr("y2", (d,i) => state.y_scale(d.id))
                    .attr("stroke-width", state.lineWidth)
                    .attr("opacity", 0.5)
                    .attr("stroke", "grey");

        }
    )

    // const minObject = widthArray.sort((a,b) => { return d3_array.ascending(new Date(a.x), new Date(b.x)) })[0]
    // const scale = (Math.abs(minObject.x) / state.width)
    // console.log("drawed", "start: ", state.x_scale(new Date(minObject.date)), "bbox: ", minObject.bbox)

    return bars
    
}

export function dummys (state, x_scale, container){

    const dummy = d3_select.select(container)
        .append("svg")
    const g = dummy.append("g")
    const widthArray = []
    const tmp = g.selectAll("rect")
        .data(state.data.persons, d => d.id )
        .join(
            enter => {
                enter
                    .append("text")
                    .attr("id", d => "test_" + d.id)
                    .text(d => d.name)
                    .style("font-family", "serif")
                    .style("font-size", state.barHeight)
                    .each(function(d, i) { 
                        const x = x_scale(new Date(d.start)) - this.getBBox().width
                        widthArray.push({x : x, date : d.start, bbox : this.getBBox().width}) 
                    })
            }
        )

    const minObject = widthArray.sort((a,b) => { return d3_array.ascending(new Date(a.x), new Date(b.x)) })[0]
    const scale = (Math.abs(minObject.x) / state.width)

    const offset = minObject.x * (1 + scale)
    const date = x_scale(new Date(minObject.date)) * (1 + scale)
    const extra = (minObject.bbox * scale) + (state.barHeight * scale)
    const calc = offset - date - extra - (2 * state.textOffset)

    // WIP! no exact calculation 

    dummy.remove()

    return { result : x_scale.invert(calc) }
}