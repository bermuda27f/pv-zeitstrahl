export function graph({ state, zoomInfo, zoomState }) {

    state.selections.bars.attr("transform", zoomState);
    state.selections.bars.selectAll(".kaiser_lines").attr('stroke-width', state.lineWidth * (1/zoomState.k));

    state.selections.zero.attr("transform", `translate(${zoomInfo.scaleX(0)}, ${0})`)
    state.selections.focus.attr('transform', zoomInfo.focus)
    state.selections.focus.select("rect").attr('stroke-width', state.navigation.strokeWidth * zoomState.k);

}

export function highlightLines ({ state }, newXScale, type){

    let selection

    switch(type){
        case "wahlen" : selection = state.selections.highlightLinesWahlenG; break;
        default: break;
    }

    selection.attr("transform", (d) => { return `translate(${newXScale(d.Datum)}, 0)`; });

}

export function bg(props, newScale, type){
    props.state.selections[type].selectAll("rect")
        .attr("x", d => { return newScale(d.start)} )
        .attr("width", d => {
            return newScale(d.end) - newScale(d.start)
        })
}

export function perioden(props, newXScale){
    props.state.selections.periodenHL
        .attr("transform", (d) => { return `translate(${newXScale(d.start)}, 0)`; })
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


export function highlights ({ state, highlight }, newScale, type){

    const coords = {
        x: newScale(highlight.element.start),
        width : newScale(highlight.element.end) - newScale(highlight.element.start)
    }
    state.selections[type + "HL"].select("#rect")
        .attr("x", coords.x)
        .attr("width", coords.width)
    state.selections[type + "HL"].select("#left")
        .attr("x1", coords.x)
        .attr("x2", coords.x)
    state.selections[type + "HL"].select("#right")
        .attr("x1", (coords.x + coords.width))
        .attr("x2", (coords.x + coords.width))
}

export function jetzt(props, newScale){
    props.state.selections.jetzt.selectAll("line")
        .attr("x1", newScale(Date.now()))
        .attr("x2", newScale(Date.now()));
    props.state.selections.jetzt.selectAll("circle").attr("cx", newScale(Date.now()));
}