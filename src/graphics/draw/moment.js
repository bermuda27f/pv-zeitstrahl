import { getKeyType } from  '../../helper/calc_set.js';
import * as d3_select from 'd3-selection';

import * as icons from '../icons.js';
import * as call from  '../../helper/events/call.js';

export function update(stateRefs, eventContainer, x_scale){

    const { state, infoElements } = stateRefs

    const events = call.events("moment", "id", stateRefs)
    const behaviour = call.behaviour(infoElements.handle_ereignisse)
    
    eventContainer.selectAll("g")
        .data(state.data.ereignisse, d => d.id)
        .join(
            (enter) => {

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

            },
            update => update
                .attr("transform", d => `translate(${x_scale(d.datum)}, 0)`),
        );

        eventContainer.selectAll("g").each(function(d){

            d3_select.select(this).lower();
            const xScale = x_scale(d.datum)
            if(xScale < 0 || xScale > state.width){
                this.remove()
            }
        })

}

export function build(stateRefs, container){

    const eventContainer = container.append("g")
        .attr("id", "eventContainer")

    update(stateRefs, eventContainer, stateRefs.state.x_scale)

    // const imgNode = events.selectAll("g.node")
    //     .data(state.data.ereignisse, d => d.id)
    //     .enter()
    //     .append("g")
    //     .attr("class", "img_node")
    //     .attr("transform", d => `translate(${state.x_scale(d.datum)}, 0)`)

    //const testArray = [lines]

    // const events = call.events(type, key, props)
    // const behaviour = call.behaviour(props.infoElements["handle_" + type])
    
    // const isHighlight = (d) => {
    //     return props.highlight.highlight_main && props.highlight.key === d[key.key] ? true : false
    // }

    // const clip = "url(#clipPath_main)"
    // const handleHeight = props.state.graph.height + props.state.handle.offset;
    
    // const symbol = (g) => g
    //     .append("g")
    //     .attr("class", "wahlenSymbol")
    //     .attr("transform", `translate(${-(props.state.handle.size / 2) - 1.5}, ${props.state.graph.height + + props.state.handle.offset}) scale(1.41)`)
    //         .append("path")
    //         .attr("id", d => "symbol_" + type + "_" + d[key.key] )
    //         .attr("d", icons.triangle)
    //         .attr("stroke-width", 1)
    //         .attr("fill",  d => isHighlight(d) ? props.state.highlightColor : props.state.ereignisHandle.color)
    //         .attr("opacity", d => isHighlight(d) ? 1 : props.state.ereignisHandle.opacity)
    //         // .call(behaviour)
    //         // .call(events)

    // const line = (g) => g
    //     .append("line")
    //     .attr("y2", + handleHeight)
    //     .attr("stroke",  d => isHighlight(d) ? props.state.highlightColor : props.state.ereignisHandle.color)
    //     .attr("stroke-width", 1)
    //     .attr("opacity", d => isHighlight(d) ? 1 : props.state.ereignisHandle.opacity)
    //     .attr("class", d => "normalLine_" + type + "_" + d[key.key])

    // const hlContainer = container
    //     .attr("clip-path", clip)
    //     .selectAll("g")
    //     .data(props.state.data[type].filter( (d) => { return d.typ !== "stopp" }))
    //         .enter()
    //         .append("g")
    //             .attr("class", "highlightLine highlightLine_" + type)
    //             .attr("transform", (d) => { return `translate(${props.state.x_scale(d[dateKey])}, 0)`})
    //             .attr("opacity", 1)
    //             .call(line)

    // hlContainer.call(symbol)
}