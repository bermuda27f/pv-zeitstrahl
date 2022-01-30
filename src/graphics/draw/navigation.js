import { setCoords } from  '../../helper/positions.js';
import * as highlighter from  './highlighter.js';

export function context(props, navigationGroup, brush) {

    const height = props.state.navigation.part

    navigationGroup.append("rect")
        .attr("width", props.state.width )
        .attr("height", props.state.navigation.height)
        .attr("fill", "none")
        .attr("stroke", "lightgrey");

    for (let i = 1; i <= 4; i++) {
        navigationGroup.append("line")
            .attr("id", "testLine")
            .attr("x1", 0)
            .attr("y1", (height * i))
            .attr("x2", props.state.width)
            .attr("y2", (height * i))
            .style("stroke", "lightgrey")
            .style("stroke-width", 1);
    }

    props.state.data.perioden.forEach((x) => {
        let position = null;
        switch (x.mainPeriod) {
            case "BRD_2": position = 0; break;
            case "BRD": position = 1; break;
            case "NS": position = 2; break;
            case "WEIMAR": position = 3; break;
            case "KAISER": position = 4; break;
            default: break;
        }

        let patterns = null;

        switch(x.type){
            case "krieg" : patterns = 'url(#hatching)'; break;
            case "phase" : patterns = 'url(#circlePattern)'; break;
            case "frieden" : patterns = props.state.standardColor; break;
            default: patterns = "none"; break;
        }
    
        let coords = setCoords(props.state, x, (props.state.navigation.part * position), "perioden", null)
    
        navigationGroup.append("rect")
            .attr("id", "navigation_period_" + x.kurz)
            .attr("x", coords.x)
            .attr("y", coords.y)
            .attr("width", coords.width)
            .attr("height", props.state.navigation.part)
            .attr("fill", patterns)
            .attr("stroke", "grey")
            .attr("opacity", 0.5)
            .attr("stroke-width", 1);
    });

    highlighter.recGraph(props, navigationGroup, "nav")
    highlighter.navHLline(props, navigationGroup, "navLine")

    const context = navigationGroup
        .append("g").attr("class", "context")
        .call(brush)

    context.select(".selection")
        .attr("fill", props.state.standardColor )
        .attr("opacity", props.state.ereignisHandle.opacity)
        .attr("stroke", props.state.standardColor);
}