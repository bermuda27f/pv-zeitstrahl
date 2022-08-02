import * as events from "../draw/events.js"
import * as lines from "../draw/lines.js"

import * as check from "../../helper/check.js"

export function graph(stateRefs) {

    const { state, zoomInfo, zoomState, uiElements } = stateRefs

    state.selections.bars.attr("transform", zoomState);

    const visible = check.eventsVisible(stateRefs, zoomInfo.scaleX, uiElements.events)

    events.set(stateRefs, state.selections.events, stateRefs.zoomInfo.scaleX, visible)
    lines.set(stateRefs, state.selections.eventLines, stateRefs.zoomInfo.scaleX, visible)

    state.selections.bars.selectAll(".kaiser_lines").attr('stroke-width', state.lineWidth * (1/zoomState.k));
    state.selections.personHL.attr("transform", zoomState);

    state.selections.zero.attr("transform", `translate(${zoomInfo.scaleX(0)}, 0)`)
    state.selections.focus.attr('transform', zoomInfo.focus)
    state.selections.focus.select("rect").attr('stroke-width', state.navigation.strokeWidth * zoomState.k);

}

export function xAxis (props, newXScale, type){

    props.state.selections.xAxis.call(props.state.x_axis.scale(newXScale))
        .call(g => g.select(".domain").attr("stroke-opacity", 1).attr("color", "grey"))
        .call(g => g.selectAll(".tick:not(:first-of-type) line").attr("stroke-opacity", 1).attr("color", "grey"))
        .call(g => g.selectAll(".tick text").text((d)=>{ return d.getFullYear() }))
        .call(g => g.selectAll(".tick text").attr("color", "grey").attr("font-size", "9pt"));
    props.state.selections.xAxisLines.call(props.state.x_axis_lines.scale(newXScale))
        .call(g => g.selectAll("line").attr("opacity", 0.1))
        .call(g => g.selectAll("path").attr("opacity", 0))
        .call(g => g.selectAll("text").remove());
}