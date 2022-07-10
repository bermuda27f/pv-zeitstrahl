import { setCoords } from  '../../helper/positions.js';

export function recGraph({ state, highlight}, container, type){

    const _highlight = container.append("g").attr("id", "BarHighLight_" + type)
        .attr("clip-path", "url(#clipPath_main")
        .style("pointer-events", "none");

    _highlight.append("rect")
        .attr("id", "rect")
        .attr("x", coords.x)
        .attr("y", 0)
        .attr("width", coords.width)
        .attr("height", height)
        .attr("fill", 'url(#hatching_hl)')
        .attr("opacity", isBarhighlight ? 1 : 0);

}