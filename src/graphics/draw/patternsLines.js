import { getKeyType } from  '../../helper/calc_set.js';

import * as icons from '../icons.js';
import * as call from  '../../helper/events/call.js';

export function frame (container, { state }){

    container.append("rect")
        .attr("class", "graphFrame")
        .attr("y", 1)
        .attr("width", state.width)
        .attr("height", state.graph.height)
        .attr("fill", "white")
        .attr("stroke", state.standardColor)
        .attr("stroke-width", 0.5)
        .attr("opacity", 0.5)

}

export function highlightLine(props, container, type){

    const imgNode = svg.selectAll("g.node")
        .data(props.state.data.ereignisse, d => d.id)
        .enter()
        .append("svg:g")
        .attr("class", "img_node")

    const defs = imgNode.append("defs")

    defs.append('pattern')
        .attr("id", function(d) { return "image"+ d.name;}  )
        .attr("width", 1)
        .attr("height", 1)
        .append("svg:image")
        .attr("xlink:href", function(d) { return d.img;})
        .attr("width", 100)
        .attr("height", 150);


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