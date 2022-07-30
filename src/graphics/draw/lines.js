import * as d3_select from 'd3-selection';
import * as d3_force from 'd3-force';
import * as call from  '../../helper/events/call.js';
import * as check from  '../../helper/check.js';

export function set(stateRefs, eventContainer, x_scale, visible){

    const { state, setState, zoomInfo, uiElements, highlight } = stateRefs

    const same = (d) => check.sameHighlight (stateRefs, "events", d.id)

    eventContainer.selectAll("g")
        .data(visible, d => d.id)
        .join(
            enter => {

                const tmpEnter = enter.append("g")
                    .attr("class", "eventLines")
                    .attr("id", d => "eventLine_" + d.id)
                    .call(enter => enter.transition(state.transition)
                        .attr("opacity", 1))
                    //.attr("transform", d => { return `translate(${x_scale(new Date(d.datum))}, ${state.handle.offset})`});

                // tmpEnter.append("line")
                //     .call(enter => enter.transition(state.transition)
                //         .attr("opacity", 1))
                //     .attr("stroke", d => highlight.highlight_main && same(d) ? state.highlightColor : state.handle.color)
                //     .attr("stroke-width", d => highlight.highlight_main && same(d) ? state.handle.lineWidth.highlight : state.handle.lineWidth.normal)
                //     .attr("opacity", state.handle.opacity)
                //     .attr("class", "eventLine");

                tmpEnter.append("line")
                    .call(enter => enter.transition(state.transition)
                        .attr("opacity", 1))
                    .attr("x1", (d) => {x_scale(new Date(d.datum))})
                    .attr("y1", state.height)
                    .attr("x2", d => x_scale(new Date(d.datum)))
                    .attr("y2", state.height + state.handle.offset + (state.handle.size * 2))
                    .attr("stroke", d => highlight.highlight_main && same(d) ? state.highlightColor : state.handle.color)
                    .attr("stroke-width", d => highlight.highlight_main && same(d) ? state.handle.lineWidth.highlight : state.handle.lineWidth.normal)
                    .attr("opacity", state.handle.opacity)
                    .attr("class", "eventLineExtra");
            },

            update => update.selectAll("line")
                .attr("x1", (d) => {x_scale(new Date(d.datum))})
                .attr("y1", state.height)
                .attr("x2", d => x_scale(new Date(d.datum)))
                .attr("y2", state.height + state.handle.offset + (state.handle.size * 2)),
            exit => exit
                .transition()
                .attr("opacity", 0)
                .attr("transform", d => `translate(${x_scale(new Date(d.datum))}, ${d.y})`)
                .remove()
        )

}