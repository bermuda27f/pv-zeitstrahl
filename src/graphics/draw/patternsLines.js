import { getKeyType, getPatterns } from  '../../helper/calc_set.js';

import * as icons from '../icons.js';
import * as call from  '../../helper/events/call.js';

export function frame (container, props){

    container.append("rect")
        .attr("class", "graphFrame")
        .attr("y", 1)
        .attr("width", props.state.width)
        .attr("height", props.state.graph.height)
        .attr("fill", "none")
        .attr("stroke", props.state.standardColor)
        .attr("stroke-width", 0.5)
        .attr("opacity", 0.5)

}

export function highlightLine(props, container, type){

    let handleHeight, clip
    const key = getKeyType(type)

    const events = call.events(type, key, props)
    const behaviour = call.behaviour(props.mutables["handle_" + type])
    const isHighlight = (d) => {
        return props.highlight.highlight_main && props.highlight.key === d[key.key] ? true : false
    }

    clip = "url(#clipPath_main)"
    handleHeight = props.state.graph.height + props.state.handle.offset;

    const symbol = (function(type){
        let tmp
        switch(type){
            case "wahlen" : 
                tmp = (g) => g
                    .append("g")
                    .attr("class", "wahlenSymbol")
                    .attr("transform", `translate(${-(props.state.handle.size / 2) - 1.5}, ${props.state.graph.height + + props.state.handle.offset}) scale(1.41)`)
                        .append("path")
                        .attr("id", d => "symbol_" + type + "_" + d[key.key] )
                        .attr("d", icons.triangle)
                        .attr("stroke-width", 1)
                        .attr("fill",  d => isHighlight(d) ? props.state.highlightColor : props.state.ereignisHandle.color)
                        .attr("opacity", d => isHighlight(d) ? 1 : props.state.ereignisHandle.opacity)
                        .call(behaviour)
                        .call(events)
                break;
            case "perioden" :
                tmp = (g) => g
                    .append("rect")
                    .attr("class", "periodenSymbol")
                    .attr("id", d => "symbol_" + type + "_" + d[key.key] )
                    .attr("width", props.state.handle.size)
                    .attr("height", props.state.handle.size)
                    .attr("x", -(props.state.handle.size / 2))
                    .attr("rx", 2)
                    .attr("ry", 2)
                    .attr("y", handleHeight)
                    .attr("opacity", d => isHighlight(d) ? 1 : props.state.ereignisHandle.opacity)
                    .attr("stroke-width", 1)
                    .attr("fill",  d => isHighlight(d) ? props.state.highlightColor : props.state.ereignisHandle.color)
                    .call(behaviour)
                    .call(events)
                default:
                    break;
                }
        return tmp
    })(type)

    const line = (g) => g
        .append("line")
        .attr("y2", + handleHeight)
        .attr("stroke",  d => isHighlight(d) ? props.state.highlightColor : props.state.ereignisHandle.color)
        .attr("stroke-width", 1)
        .attr("opacity", d => isHighlight(d) ? 1 : props.state.ereignisHandle.opacity)
        .attr("class", d => "normalLine_" + type + "_" + d[key.key])

    let dateKey = type === "perioden" ? "start" : "Datum"

    const hlContainer = container
        .attr("clip-path", clip)
        .selectAll("g")
        .data(props.state.data[type].filter( (d) => { return d.typ !== "stopp" }))
            .enter()
            .append("g")
                .attr("class", "highlightLine " + "highlightLine_" + type)
                .attr("transform", (d) => { return `translate(${props.state.x_scale(new Date(d[dateKey]))}, 0)`})
                .attr("opacity", 1)
                .call(line)

    hlContainer.call(symbol)
}

export function graphBackground (container, props) {

    let height = props.state.graph.height

    container.selectAll("rect")
        .data(props.state.data.perioden)
            .enter()
            .append("rect")
            .attr("class", function (d) {return "periodenBG_" + d.kurz })
            .attr("clip-path", "url(#clipPath_main)")
            .attr("x", d => { return props.state.x_scale(new Date(d.start)) })
            .attr("width", d => { return props.state.x_scale(new Date(d.end)) - props.state.x_scale(new Date(d.start)) })
            .attr("height", height)
            .attr("fill", d => getPatterns(d.type))
            .attr("stroke", "grey")
            .attr("stroke-width", 0.1)
            .attr("opacity", 1)
}