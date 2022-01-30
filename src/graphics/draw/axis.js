export function x (props, graphGroup, type) {

    let lines, height, className
    switch(type){
        case "main" :
            lines = props.state.x_axis_lines;
            height = props.state.graph.height;
            className = "xAxisLines noselect"
            break;
        default :
            break;
    }

    if(type === "main") {
        graphGroup.append("g")
            .attr("id", "x_axis")
            .attr("class", "xAxis noselect")
            .attr("transform", `translate(${ 0 }, ${ height })`)
            .call(props.state.x_axis)
            .call(g => g.select(".domain").attr("stroke-opacity", 1).attr("color", "grey"))
            .call(g => g.selectAll(".tick:not(:first-of-type) line").attr("stroke-opacity", 1).attr("color", "grey"))
            .call(g => g.selectAll(".tick text").attr("color", "grey"))
            .call(g => g.selectAll(".tick text").attr("font-size", "9pt"));
    }

    graphGroup.append("g")
        .attr("class", className)
        .call(lines)
        .call(g => g.selectAll("line").attr("opacity", 0.1))
        .call(g => g.selectAll("path").attr("opacity", 0))
        .call(g => g.selectAll("text").remove());

}

export function y (props, graphGroup) {

    let axisNorm = props.state.y_axis
    let axisLines = props.state.y_axis_lines

    graphGroup.append("g")
        .attr("id", "y_axis")
        .attr("class", "yAxis noselect")
        .call(axisNorm)
        .call(g => g.select(".domain").attr("stroke-opacity", 1).attr("color", "grey"))
        .call(g => g.selectAll(".tick:not(:first-of-type) line").attr("stroke-opacity", 1).attr("color", "grey"))
        .call(g => g.selectAll(".tick text").attr("color", "grey"))
        .call(g => g.selectAll(".tick text").attr("font-size", "9pt"));
    
    graphGroup.append("g")
        .attr("id", "y_axis_lines")
        .attr("class", "yAxisLines noselect")
        .attr("transform", `translate(${ props.state.width}, ${ 0 })`)
        .call(axisLines)
        .call(g => g.selectAll("line").attr("opacity", 0.1))
        .call(g => g.selectAll("path").attr("opacity", 0))
        .call(g => g.selectAll("text").remove());

}