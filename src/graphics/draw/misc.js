export function huerde({ state }, container) {

    const lineContainer = container.append("g")
        .attr("id", "fuenfProzent")
        .attr("clip-path", "url(#clipPath_main)");

    const xP = state.x_scale(new Date(state.defaultValues.huerdeDate));

    lineContainer.append("line")
        .attr("id", "fuenfProzent_x")
        .attr("x1", xP)
        .attr("x2", state.x_scale(new Date(state.defaultValues.stopDate)))
        .attr("y1", state.y_scale(5))
        .attr("y2", state.y_scale(5))
        .attr("opacity", state.huerde.opacity)
        .attr("stroke-width", 1)
        .attr("stroke", "black")
        .style("stroke-dasharray", state.huerde.stroke);
        
    lineContainer.append("line")
        .attr("id", "fuenfProzent_y")
        .attr("x1", xP)
        .attr("x2", xP)
        .attr("y1", 0)
        .attr("y2", state.graph.height)
        .attr("opacity", state.huerde.opacity)
        .attr("stroke-width", 1)
        .attr("stroke", "black")
        .style("stroke-dasharray", state.huerde.stroke);
}

export function jetzt({ state }, container, type) {

    const jetztContainer = container.append("g")
        .attr("class", "jetzt")
        .attr("clip-path", "url(#clipPath_main)")

    const x = state.x_scale(Date.now());
    const r = 3
    const height = type === "main" ? state.graph.height : state.extraGraph.height

    jetztContainer.append("line")
        .attr("x1", x)
        .attr("x2", x)
        .attr("y1", 0)
        .attr("y2", height)
        .attr("opacity", 1)
        .attr("stroke-width", 0.25)
        .attr("stroke", state.standardColor)
    if(type === "main"){
        jetztContainer.append("circle")
            .attr("cx", x)
            .attr("cy", height + (r))
            .attr("r", r)
            .attr("opacity", 0.25)
            .attr("fill", state.standardColor)
    }
}