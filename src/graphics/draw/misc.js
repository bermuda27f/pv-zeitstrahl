
import * as icons from '../icons.js';
import * as d3_select from 'd3-selection';

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

    const x = state.x_scale(0) - 1;
    const y_offset = icons.jesus.circle.r + 5
    const test = new Date("-001999-03-11T00:00:00")
    console.log(test)

    const zero = container.append("g")
        .attr("id", "zero")
        //.attr("clip-path", "url(#clipPath_main)")
        .attr("transform", `translate(${x}, ${0})`)
        .attr("opacity", 1)

    const jesus = (g, color) => {

        const jesusPaths = (g, path) => {
            g.append("path")
                .attr("d", path)
                .attr("transform", `translate(${-icons.jesus.circle.r - 2}, ${-y_offset - icons.jesus.circle.r })`)
                .attr("fill", color)
        }
        g.append("circle")
            // .attr("cx", 0)
            .attr("cy", -y_offset)
            .attr("r", icons.jesus.circle.r)
            .attr("stroke-width", icons.jesus.circle.strokeWidth)
            .attr("stroke", color)
            .attr("fill", "none")
        g.call(jesusPaths, icons.jesus.path1.d)
        g.call(jesusPaths, icons.jesus.path2.d)
        g.call(jesusPaths, icons.jesus.path3.d)
        g.call(jesusPaths, icons.jesus.path4.d)
        g.call(jesusPaths, icons.jesus.path5.d)
        g.call(jesusPaths, icons.jesus.path6.d)
        g.call(jesusPaths, icons.jesus.path7.d)
        g.call(jesusPaths, icons.jesus.path8.d)
        g.call(jesusPaths, icons.jesus.path9.d)

    }

    zero.append("line")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1",  -3)
        .attr("y2", state.height )
        .attr("stroke-width", 1.5)
        .attr("stroke", "black")

    zero.append("g")
        .attr("id", "jesusIcon")
        .attr("transform", "scale(0.4)")
        .call(jesus, "black")

}

export function map({state}, bars, container ){

    const map = bars.clone(true)
        .attr("id", "minimap")
        .attr("transform", `translate(${state.navigation.x}, ${state.navigation.y}) scale(${state.navigation.scale})`);
    // const mapHighlight = highlight.clone(true)
    //     .attr("id", "_minimap_highlight")
    //     .attr("transform", `translate(${state.navigation.x}, ${state.navigation.y}) scale(${state.navigation.scale})`);

    map.selectAll("text").remove()
    map.selectAll("line").remove()
    map.selectAll("rect").attr('id', null)

    const mapBG = map
        .append("rect")
        .attr("id", "cool")
        .attr("width", state.width).attr("height", state.height)
        .attr("fill", "white")
        .attr("stroke", "black").attr("stroke-width", 0.5);

    const focus = map.append("g")
        .attr("id", "_focus")
        .append("rect").attr("x", 0).attr("y", 0)
        .attr("width", state.width).attr("height", state.height)
        .attr("fill", "none")
        .attr("stroke", "black").attr("stroke-width", state.navigation.strokeWidth);
  
    mapBG.lower();
    //mapHighlight.raise();

}