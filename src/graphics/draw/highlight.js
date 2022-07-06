import { setCoords } from  '../../helper/positions.js';

export function recGraph({ state, highlight}, container, type){

    const _highlight = container.append("g").attr("id", "BarHighLight_" + type)
        .attr("clip-path", "url(#clipPath_main")
        .style("pointer-events", "none");

    const isBarhighlight = highlight.highlight_main && highlight.ident === "perioden"

    let coords, height
    if(highlight.ident === "perioden"){ coords = setCoords(state, highlight.element, 0, isBarhighlight ? "resize" : "init", "end") }
    else { coords = setCoords(state, highlight.element, 0, isBarhighlight ? "resize" : "init", "stopp")}

    switch(type){
        case "extra" : height = state.extraGraph.height; break;
        case "main" : height = state.graph.height; break;
        case "nav" : height = state.navigation.height; break;
        default: break;
    }

    _highlight.append("rect")
        .attr("id", "rect")
        .attr("x", coords.x)
        .attr("y", 0)
        .attr("width", coords.width)
        .attr("height", height)
        .attr("fill", 'url(#hatching_hl)')
        .attr("opacity", isBarhighlight ? 1 : 0);

    _highlight.append("line")
        .attr("id", "left")
        .attr("x1", coords.x)
        .attr("y1", 0)
        .attr("x2", coords.x)
        .attr("y2", height)
        .attr("stroke", state.highlightColor )
        .attr("stroke-width", 0.4)
        .attr("opacity", isBarhighlight ? 1 : 0);

    _highlight.append("line")
        .attr("id", "right")
        .attr("x1", coords.width + coords.x)
        .attr("y1", 0)
        .attr("x2", coords.width + coords.x)
        .attr("y2", height)
        .attr("stroke", state.highlightColor )
        .attr("stroke-width", 0.4)
        .attr("opacity", isBarhighlight ? 1 : 0);
}