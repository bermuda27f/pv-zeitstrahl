export function set(defs, { state }) {

    defs.append("clipPath")
        .attr("id", "clipPath_main")
            .append("rect")
            .attr("x", state.margin.left)
            .attr("y", state.margin.top)
            .attr("width", state.width )
            .attr("height", state.graph.height);
    defs.append("clipPath")
        .attr("id", "clipPath_events")
            .append("rect")
            .attr("width", state.width )
            .attr("height", state.mainGraphHeight);

    defs.append('pattern')
        .attr('width', 4)
        .attr('height', 4)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('id', 'hatching')
            .append('path')
            .attr('d', "M-1,1 l2,-2 M0,4 l4,-4  M3,5 l2,-2")
            .style('stroke', "black")
            .style('opacity', 0.5)
            .style('stroke-width', 0.5);

    // SPECIAL:

    defs.append('pattern')
        .attr('width', 2)
        .attr('height', 2)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('patternTransform', 'rotate(45)')
        .attr('id', 'circlePattern')
            .append('circle')
            .style('fill', "grey")
            .style('opacity', 1)
            .attr('r', .25)
            .attr('cx', .5)
            .attr('cy', .5);
}