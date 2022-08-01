import * as d3_select from 'd3-selection';
import * as d3_force from 'd3-force';
import * as call from  '../../helper/events/call.js';
import * as check from  '../../helper/check.js';
import * as simulation from  '../../helper/simulation.js';

export function set(stateRefs, eventContainer, x_scale, visible){

    const { state, setState, zoomInfo, uiElements, highlight } = stateRefs

    const events = call.events("events", "id", stateRefs)
    const behaviour = call.behaviour(uiElements.events)
    const same = (d) => check.sameHighlight (stateRefs, "events", d.id)

    const eventSymbols = eventContainer.selectAll("g")
        .data(visible, d => d.id)
        .join(
            enter => {

                const tmpEnter = enter.append("g")
                    .attr("class", "img_node")
                    .attr("id", d => "img_node_" + d.id)
                    .call(enter => enter.transition(state.transition)
                        .attr("opacity", 1))
                    .attr("transform", d => { return `translate(${x_scale(new Date(d.datum))}, ${state.handle.offset})`});

                tmpEnter.append("defs")
                    .append('pattern')
                        .attr("id", function(d) { return "clipImage_"+ d.id;}  )
                        .attr("width", 1)
                        .attr("height", 1)
                        .append("image")
                            .attr("href", function(d) { return require('../../img/thumb/' + d.src_name + '.jpg') })
                            .attr("width", 2 * state.handle.size)
                            .attr("height", 2 * state.handle.size);

                tmpEnter.append("circle")
                    .attr("cy", state.height + state.handle.offset + state.handle.size)
                    .attr("stroke", d => highlight.highlight_main && same(d) ? state.highlightColor : state.handle.color)
                    .attr("stroke-width", d => highlight.highlight_main && same(d) ? state.handle.lineWidth.highlight : state.handle.lineWidth.normal)
                    .attr("stroke-location", "outer")
                    .attr("fill",function(d) { return "url(#clipImage_"+ d.id +")" }  )
                    .attr("r", state.handle.size)
                    .call(events)
                    .call(behaviour)
            },
            update => update.attr("transform", d => `translate(${x_scale(new Date(d.datum))}, ${state.handle.offset})`),
            exit => exit
                .transition()
                .attr("opacity", 0)
                .attr("transform", d => `translate(${x_scale(new Date(d.datum))}, ${state.handle.offset})`)
                .remove()
        )

    const sim = simulation.calcTicks(state, x_scale, visible)

    const lineSel = state.selectionsSet ? 
        state.selections.eventLines.selectAll(".eventLine_axis") : 
        d3_select.selectAll(".eventLine_axis")

    lineSel
        .attr("x2", function (d) { 
            const xCoord = sim.nodes().find((nodes) => { return nodes.id === d.id })
            if(xCoord === undefined) { this.remove(); }
            return xCoord ? xCoord.x : state.width
        })
        
    eventSymbols.attr("transform", function (d) { 
        return`translate(${d.x}, ${state.handle.offset})`; 
    })
}