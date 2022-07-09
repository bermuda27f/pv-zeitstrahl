import * as handles from "../draw/moment.js"

export function graph(stateRefs) {

    const { state, zoomInfo, zoomState } = stateRefs

    state.selections.bars.attr("transform", zoomState);
    state.selections.bars.selectAll(".kaiser_lines").attr('stroke-width', state.lineWidth * (1/zoomState.k));

    state.selections.zero.attr("transform", `translate(${zoomInfo.scaleX(0)}, 0)`)
    state.selections.zero.attr("transform", `translate(${zoomInfo.scaleX(0)}, 0)`)

    handles.update(stateRefs, state.selections.events, zoomInfo.scaleX)

    state.selections.focus.attr('transform', zoomInfo.focus)
    state.selections.focus.select("rect").attr('stroke-width', state.navigation.strokeWidth * zoomState.k);

}

export function xAxis (props, newXScale, type){

    let lines, selectionName
    switch(type){
        case "main" :
            lines = props.state.x_axis_lines;
            selectionName = "xAxisLines"
            break;
        case "extra" :
            lines = props.state.x_axis_lines_extra;
            selectionName = "xAxisLinesExtra"
            break;
        default :
            break;
    }

    props.state.selections.xAxis.call(props.state.x_axis.scale(newXScale))
        .call(g => g.select(".domain").attr("stroke-opacity", 1).attr("color", "grey"))
        .call(g => g.selectAll(".tick:not(:first-of-type) line").attr("stroke-opacity", 1).attr("color", "grey"))
        .call(g => g.selectAll(".tick text").attr("color", "grey").attr("font-size", "9pt"));
    props.state.selections[selectionName].call(lines.scale(newXScale))
        .call(g => g.selectAll("line").attr("opacity", 0.1))
        .call(g => g.selectAll("path").attr("opacity", 0))
        .call(g => g.selectAll("text").remove());
}