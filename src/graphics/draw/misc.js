export function lines({ state }, container) {

    const lineContainer = container.append("g")
        .attr("id", "lineContainer")
        .attr("clip-path", "url(#clipPath_main)");
        
    lineContainer.append("g").attr("id", "lines_t")
        .selectAll("line")
            .data(state.data.kaiser, d => d.id)
            .join("line")
            .attr("id", d => "line" + d.name)
            .attr("x1", 0)
            .attr("y1", (d,i) => state.y_scale(d.id + 3))
            .attr("x2", state.width)
            .attr("y2", (d,i) => state.y_scale(d.id + 3))
            .attr("stroke-width", 0.25)
            .attr("stroke", "grey");
}

export function zero({ state }, container) {

    const zero = container.append("g")
        .attr("id", "zero")
        .attr("clip-path", "url(#clipPath_main)")

    const x = state.x_scale(new Date(0)) - 1;

    zero.append("line")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", 0)
        .attr("y2", state.height)
        .attr("opacity", 0.5)
        .attr("stroke-width", 0.77)
        .attr("stroke", "red")
}