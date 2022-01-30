export function curves(props, newXScale) {

    const newX = date => { return newXScale(new Date(date)) }
    props.state.lines.partei.x(d => newX(d.Datum));
    props.state.selections.paths.attr("d", props.state.lines.partei);
    props.state.selections.pathsClick.attr("d", props.state.lines.partei);
    props.state.selections.circles.attr("cx", d => newX(d.Datum));
    props.state.selections.parteiLabel.attr("x", d => (newX(d.Datum) - 5));
    props.state.selections.fuenfProzentX.attr("x1", newX(props.state.defaultValues.huerdeDate));
    props.state.selections.fuenfProzentY
        .attr("x1", newX(props.state.defaultValues.huerdeDate))
        .attr("x2", newX(props.state.defaultValues.huerdeDate));
}

export function highlightLines (props, newXScale, type){

    let selection

    switch(type){
        case "wahlen" : selection = props.state.selections.highlightLinesWahlenG; break;
        default: break;
    }

    selection.attr("transform", (d) => { return `translate(${newXScale(new Date(d.Datum))}, 0)`; });

}

export function bg(props, newScale, type){
    props.state.selections[type].selectAll("rect")
        .attr("x", d => { return newScale(new Date(d.start))} )
        .attr("width", d => {
            return newScale(new Date(d.end)) - newScale(new Date(d.start))
        })
}

export function perioden(props, newXScale){
    props.state.selections.periodenHL
        .attr("transform", (d) => { return `translate(${newXScale(new Date(d.start))}, 0)`; })
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


export function highlights (props, newScale, type){

    const endData = props.highlight.ident === "perioden" ? "end" : "stopp";

    const date_start = new Date(props.highlight.element.start)
    const date_end = new Date(props.highlight.element[endData]);
    const coords = {
        x: newScale(date_start),
        width : newScale(date_end) - newScale(date_start)
    }
    props.state.selections[type + "HL"].select("#rect")
        .attr("x", coords.x)
        .attr("width", coords.width)
    props.state.selections[type + "HL"].select("#left")
        .attr("x1", coords.x)
        .attr("x2", coords.x)
    props.state.selections[type + "HL"].select("#right")
        .attr("x1", (coords.x + coords.width))
        .attr("x2", (coords.x + coords.width))
}

export function jetzt(props, newScale){
    props.state.selections.jetzt.selectAll("line")
        .attr("x1", newScale(Date.now()))
        .attr("x2", newScale(Date.now()));
    props.state.selections.jetzt.selectAll("circle").attr("cx", newScale(Date.now()));
}