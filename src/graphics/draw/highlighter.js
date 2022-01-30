import { setCoords } from  '../../helper/positions.js';

export function recGraph(props, container, type){

    const highlight = container.append("g").attr("id", "BarHighLight_" + type)
        .attr("clip-path", "url(#clipPath_main")
        .style("pointer-events", "none");

    const isBarhighlight = props.highlight.highlight_main && props.highlight.ident === "perioden"

    let coords, height
    if(props.highlight.ident === "perioden"){ coords = setCoords(props.state, props.highlight.element, 0, isBarhighlight ? "resize" : "init", "end") }
    else { coords = setCoords(props.state, props.highlight.element, 0, isBarhighlight ? "resize" : "init", "stopp")}

    switch(type){
        case "extra" : height = props.state.extraGraph.height; break;
        case "main" : height = props.state.graph.height; break;
        case "nav" : height = props.state.navigation.height; break;
        default: break;
    }

    highlight.append("rect")
        .attr("id", "rect")
        .attr("x", coords.x)
        .attr("y", 0)
        .attr("width", coords.width)
        .attr("height", height)
        .attr("fill", 'url(#hatching_hl)')
        .attr("opacity", isBarhighlight ? 1 : 0);

    highlight.append("line")
        .attr("id", "left")
        .attr("x1", coords.x)
        .attr("y1", 0)
        .attr("x2", coords.x)
        .attr("y2", height)
        .attr("stroke", props.state.highlightColor )
        .attr("stroke-width", 0.4)
        .attr("opacity", isBarhighlight ? 1 : 0);

    highlight.append("line")
        .attr("id", "right")
        .attr("x1", coords.width + coords.x)
        .attr("y1", 0)
        .attr("x2", coords.width + coords.x)
        .attr("y2", height)
        .attr("stroke", props.state.highlightColor )
        .attr("stroke-width", 0.4)
        .attr("opacity", isBarhighlight ? 1 : 0);
}

export function navHLline(props, container, type){

    const highlight = container.append("g")
        .attr("id", type)
        .style("pointer-events", "none");

    const isLineHighlight = 
        props.highlight.highlight_main &&
        (props.highlight.ident !== "perioden" &&
        props.highlight.ident !== "partei")

    const coords = isLineHighlight ? setCoords(props.state, props.highlight.element, 0, "line", null) : setCoords(props.state, null, 0, "init", null)

    highlight.append("line")
        .attr("id", "left")
        .attr("x1", coords.x)
        .attr("y1", 0)
        .attr("x2", coords.x)
        .attr("y2", props.state.navigation.height)
        .attr("stroke", props.state.highlightColor )
        .attr("opacity", 1)
        .attr("stroke-width", 0.5)
        .attr("opacity", 0);
}