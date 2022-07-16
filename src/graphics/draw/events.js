import * as d3_select from 'd3-selection';
import * as call from  '../../helper/events/call.js';
import * as check from  '../../helper/check.js';

export function update(stateRefs, eventContainer, x_scale){

    const { state, infoElements, highlight } = stateRefs

    const events = call.events("events", "id", stateRefs)
    const behaviour = call.behaviour(infoElements.handle_ereignisse)

    eventContainer.selectAll("g")
        .data(state.data.events, d => d.id)
        .join(
            enter => {
                const same = (d) => check.sameHighlight (stateRefs, "events", d.id)

                const tmpEnter = enter.append("g")
                    .attr("class", "img_node")
                    .attr("id", d => "img_node_" + d.id)
                    .call(enter => enter.transition(state.transition)
                        .attr("opacity", 1))
                    .attr("transform", d => `translate(${x_scale(d.datum)}, 0)`);

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
 
                tmpEnter.append("line")
                    .attr("y2", + state.height + state.handle.offset )
                    .attr("stroke", d => highlight.highlight_main && same(d) ? state.highlightColor : state.handle.color)
                    .attr("stroke-width", d => highlight.highlight_main && same(d) ? state.handle.lineWidth.highlight : state.handle.lineWidth.normal)
                    .attr("opacity", state.handle.opacity)
                    .attr("class", "eventLine");

                return tmpEnter

            }
        ).each(function(d){
            if(highlight.highlight_main && d.id !== highlight.key) d3_select.select(this).lower();
            const xScale = x_scale(d.datum)
            if(xScale < 0 || xScale > state.width) {
                d3_select.select(this).remove()
            }
        });

}