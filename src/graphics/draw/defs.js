export function set(defs, { state }) {

    defs.append("clipPath")
        .attr("id", "clipPath_main")
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", state.width + state.margin.left + state.margin.right)
            .attr("height", state.graph.height + state.handle.offset + state.handle.size);

    defs.append('pattern')
        .attr('width', 4)
        .attr('height', 4)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('id', 'hatching')
            .append('path')
            .attr('d', "M-1,1 l2,-2 M0,4 l4,-4  M3,5 l2,-2")
            .style('stroke', state.standardColor)
            .style('opacity', 0.5)
            .style('stroke-width', 0.5);

    // SPECIAL:

    defs.append('pattern')
        .attr('width', 4)
        .attr('height', 4)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('id', 'hatching_nsdap')
            .append('path')
            .attr('d', "M-1,1 l2,-2 M0,4 l4,-4  M3,5 l2,-2")
            .style('stroke', 'brown')
            .style('opacity', 0.5)
            .style('stroke-width', 2);

    defs.append('pattern')
        .attr('width', 4)
        .attr('height', 4)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('id', 'hatching_sed')
            .append('path')
            .attr('d', "M-1,1 l2,-2 M0,4 l4,-4  M3,5 l2,-2")
            .style('stroke', 'purple')
            .style('opacity', 0.5)
            .style('stroke-width', 2);

    defs.append('pattern')
        .attr('width', 4)
        .attr('height', 4)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('id', 'hatching_cdu')
            .append('path')
            .attr('d', "M-1,1 l2,-2 M0,4 l4,-4  M3,5 l2,-2")
            .style('stroke', 'black')
            .style('opacity', 0.5)
            .style('stroke-width', 2);

    defs.append('pattern')
        .attr('width', 4)
        .attr('height', 4)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('id', 'hatching_ldpd')
            .append('path')
            .attr('d', "M-1,1 l2,-2 M0,4 l4,-4  M3,5 l2,-2")
            .style('stroke', 'gold')
            .style('opacity', 0.5)
            .style('stroke-width', 2);

    //

    defs.append('pattern')
        .attr('width', 4)
        .attr('height', 4)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('patternTransform', 'rotate(45)')
        .attr('id', 'circlePattern')
            .append('circle')
            .style('fill', state.standardColor)
            .style('opacity', 0.5)
            .attr('r', 1)
            .attr('cx', 0)
            .attr('cy', 0);

    defs.append('pattern')
        .attr('width', 5)
        .attr('height', 5)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('patternTransform', 'rotate(0)')
        .attr('id', 'circlePattern_wide')
            .append('circle')
            .style('fill', 'lightgrey')
            .style('opacity', 1)
            .attr('r', 0.5)
            .attr('cx', 4)
            .attr('cy', 4);

    defs.append('pattern')
        .attr('width', 3)
        .attr('height', 3)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('id', 'highlight_pattern')
            .append('circle')
            .style('fill', 'darksalmon')
            .style('opacity', 0.75)
            .attr('r', 1)
            .attr('cx', 0)
            .attr('cy', 0);
    defs.append('pattern')
        .attr('width', 4)
        .attr('height', 4)
        .attr('patternUnits', 'userSpaceOnUse')
        .attr('id', 'hatching_hl')
            .append('path')
            .attr('d', "M-1,1 l2,-2 M0,4 l4,-4  M3,5 l2,-2")
            .style('stroke', "magenta")
            .style('opacity', 0.5)
            .style('stroke-width', 0.25);
}