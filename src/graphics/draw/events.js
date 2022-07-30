import * as d3_select from 'd3-selection';
import * as d3_force from 'd3-force';
import * as call from  '../../helper/events/call.js';
import * as check from  '../../helper/check.js';

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

                // tmpEnter.append("line")
                //     .call(enter => enter.transition(state.transition)
                //         .attr("opacity", 1))
                //     .attr("stroke", d => highlight.highlight_main && same(d) ? state.highlightColor : state.handle.color)
                //     .attr("stroke-width", d => highlight.highlight_main && same(d) ? state.handle.lineWidth.highlight : state.handle.lineWidth.normal)
                //     .attr("opacity", state.handle.opacity)
                //     .attr("class", "eventLine");

                // tmpEnter.append("line")
                //     .call(enter => enter.transition(state.transition)
                //         .attr("opacity", 1))
                //     .attr("x1", d => x_scale(new Date(d.datum)))
                //     .attr("y1", state.height)
                //     .attr("x2", d => d.x)
                //     .attr("y2", state.height + state.handle.offset + (state.handle.size * 2))
                //     .attr("stroke", d => highlight.highlight_main && same(d) ? state.highlightColor : state.handle.color)
                //     .attr("stroke-width", d => highlight.highlight_main && same(d) ? state.handle.lineWidth.highlight : state.handle.lineWidth.normal)
                //     .attr("opacity", state.handle.opacity)
                //     .attr("class", "eventLineExtra");
            },
            update => update.attr("transform", d => `translate(${x_scale(new Date(d.datum))}, ${state.handle.offset})`),
            exit => exit
                .transition()
                .attr("opacity", 0)
                .attr("transform", d => `translate(${x_scale(new Date(d.datum))}, ${d.y})`)
                .remove()
        )

    const simulation = d3_force.forceSimulation(visible)
        .force("x", d3_force.forceX(function(d){
            d.x = x_scale(new Date(d.datum))
            return d.x
            })
        )
        .force("y", d3_force.forceY(function(d){
            d.y = state.handle.offset
            return d.y
        }))
        .force("collision", d3_force.forceCollide()
            .strength(1)
            .radius(state.handle.size))
            .stop()

    for(let i = 0; i < 150; i++) simulation.tick()

    eventSymbols.attr("transform", (d) => {
        return`translate(${d.x}, ${state.handle.offset})`;
    })
}