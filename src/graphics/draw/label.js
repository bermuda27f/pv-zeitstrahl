export function x_axis ({ state }, container) {

    container.append("g")
        .attr("class", "yAxisLabel noselect")
        .attr("opacity", 1)
        .attr("id", "label")
        .attr("transform", `translate(${ state.width }, ${ state.height + state.handle.offset })`)
            .append("text").attr("text-anchor", "end")
            .style("fill", "grey")
            .style("font-family", "sans-serif")
            .style("font-size", "10pt")
            .text("year")
    }