export function x ({ state }, axisContainer) {

    axisContainer.append("g")
        .attr("id", "x_axis")
        .attr("class", "xAxis noselect")
        .attr("transform", `translate(${ 0 }, ${ state.graph.height })`)
        .call(state.x_axis)
        .call(g => g.select(".domain").attr("stroke-opacity", 1).attr("color", "grey"))
        .call(g => g.selectAll(".tick:not(:first-of-type) line").attr("stroke-opacity", 1).attr("color", "grey"))
        .call(g => g.selectAll(".tick text").text((d)=>{ return d.getFullYear() }))
        .call(g => g.selectAll(".tick text").attr("color", "grey"))
        .call(g => g.selectAll(".tick text").attr("font-size", "9pt"));

    axisContainer.append("g")
        .attr("class", "xAxisLines noselect")
        .call(state.x_axis_lines)
        .call(g => g.selectAll("line").attr("opacity", 0.1))
        .call(g => g.selectAll("path").attr("opacity", 0))
        .call(g => g.selectAll("text").remove());

}