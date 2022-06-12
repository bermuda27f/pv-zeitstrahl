
export function lines({ state }, container) {

    const lineContainer = container.append("g")
        .attr("id", "lineContainer")
        .attr("clip-path", "url(#clipPath_main)");
        
    lineContainer.append("g").attr("id", "lines_t")
        .selectAll("line")
            .data(state.data.kaiser, d => d.id)
            .join("line")
            .attr("class", d => "kaiser_lines")
            .attr("x1", 0)
            .attr("y1", (d,i) => state.y_scale(d.id + 3))
            .attr("x2", state.width)
            .attr("y2", (d,i) => state.y_scale(d.id + 3))
            .attr("stroke-width", 0.25)
            .attr("opacity", 0.5)
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

export function map({state}, bars, container ){

    const map = bars.clone(true)
        .attr("id", "minimap")
        .attr("transform", `translate(${state.navigation.x}, ${state.navigation.y}) scale(${state.navigation.scale})`);
    // const mapHighlight = highlight.clone(true)
    //     .attr("id", "_minimap_highlight")
    //     .attr("transform", `translate(${state.navigation.x}, ${state.navigation.y}) scale(${state.navigation.scale})`);

    map.selectAll("text").remove()

    const mapBG = container.append("g")
        .attr("transform", `translate(${state.navigation.x}, ${state.navigation.y}) scale(${state.navigation.scale})`)
        .append("rect")
        .attr("width", state.width).attr("height", state.height)
        .attr("fill", "none")
        .attr("stroke", "black").attr("stroke-width", 0.5);
    const focus = map.append("g")
        .attr("id", "_focus")
        .append("rect").attr("x", 0).attr("y", 0)
        .attr("width", state.width).attr("height", state.height)
        .attr("fill", "none")
        .attr("stroke", "magenta").attr("stroke-width", state.navigation.strokeWidth);
  
    map.raise();
    //mapHighlight.raise();

}