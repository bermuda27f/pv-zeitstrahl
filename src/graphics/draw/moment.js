import * as d3_select from 'd3-selection';
import * as call from  '../../helper/events/call.js';

export function update(stateRefs, eventContainer, x_scale){

    const { state, infoElements } = stateRefs

    const events = call.events("events", "id", stateRefs)
    const behaviour = call.behaviour(infoElements.handle_ereignisse)
    
    eventContainer.selectAll("g")
        .data(state.data.events, d => d.id)
        .join(
            enter => {
                const tmpEnter = enter.append("g")
                    .attr("class", "img_node")
                    .call(enter => enter.transition(state.transition)
                        .attr("opacity", 1))
                    .attr("transform", d => `translate(${x_scale(d.datum)}, 0)`);

                tmpEnter.append("defs")
                    .append('pattern')
                        .attr("id", function(d) { return "clipImage_"+ d.id;}  )
                        .attr("width", 1)
                        .attr("height", 1)
                        .append("image")
                            .attr("href", function(d) { 
                                return require('../../img/thumb/' + d.src_name + '.jpg')
                                })
                            .attr("width", 2 * state.handle.size)
                            .attr("height", 2 * state.handle.size);

                tmpEnter.append("circle")
                    .attr("cy", state.height + state.handle.offset + state.handle.size)
                    .attr("stroke", state.handle.color)
                    .attr("stroke-width", 1)
                    .attr("fill",function(d) { return "url(#clipImage_"+ d.id +")" }  )
                    .attr("r", state.handle.size)
                    .call(events)
                    .call(behaviour)

                tmpEnter.append("line")
                    .attr("y2", + state.height + state.handle.offset )
                    .attr("stroke",  state.handle.color)
                    .attr("stroke-width", .4)
                    .attr("opacity", .75)
                    .attr("class", "eventLine");

                return tmpEnter

            }
        );

        eventContainer.selectAll("g").each(function(d){

            d3_select.select(this).lower();
            const xScale = x_scale(d.datum)
            if(xScale < 0 || xScale > state.width)  d3_select.select(this).transition(state.transition).attr("opacity", 0).remove()
        })

}

export function build(stateRefs, container){

    const eventContainer = container.append("g")
        .attr("id", "eventContainer")

    update(stateRefs, eventContainer, stateRefs.state.x_scale)

}