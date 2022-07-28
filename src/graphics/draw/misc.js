
import * as icons from '../icons.js';
import * as d3_select from 'd3-selection';

export function frame (container, { state }){

    container.append("rect")
        .attr("class", "graphFrame")
        .attr("y", 1)
        .attr("width", state.width)
        .attr("height", state.graph.height)
        .attr("fill", "white")
        .attr("stroke", state.standardColor)
        .attr("stroke-width", 0.1)
        .attr("opacity", 1)

}

export function highlight({ state, highlight}, container){

    const _highlight = container.append("g").attr("id", "BarHighlight")
        .style("pointer-events", "none");
    
    const active = highlight.highlight_main && highlight.ident === "persons"

    _highlight.append("rect")
        .attr("y", active ? state.y_scale(highlight.key) : 0)
        .attr("width", state.width)
        .attr("height", state.barHeight)
        .attr("fill", "cyan")
        .attr("opacity", active ? 1 : 0);

}

export function lines({ state }, container) {

    const lineContainer = container.append("g")
        .attr("id", "lineContainer")
        .attr("clip-path", "url(#clipPath_main)");
        
    lineContainer.append("g").attr("id", "lines_t")
        .selectAll("line")
            .data(state.data.persons, d => d.id)
            .join("line")
            .attr("class", d => "kaiser_lines")
            .attr("x1", 0)
            .attr("y1", (d,i) => state.y_scale(d.id))
            .attr("x2", state.width)
            .attr("y2", (d,i) => state.y_scale(d.id))
            .attr("stroke-width", 0.25)
            .attr("opacity", 0.5)
            .attr("stroke", "grey");
}

export function zero({ state }, container, jesus) {

    const x = state.x_scale(0);
    const y_offset = icons.jesus.circle.r + 5
    const test = new Date("-001999-03-11T00:00:00")

    const zero = container.append("g")
        .attr("id", "zero")
        //.attr("clip-path", "url(#clipPath_main)")
        .attr("transform", `translate(${x}, ${0})`)
        .attr("opacity", 1)

    const drawJesus = (g, color) => {

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
        
        for(let i = 1; i< 9; i++ ){ g.call(jesusPaths, icons.jesus["path" + i].d)}

    }

    zero.append("line")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1",  jesus ? -3 : 0)
        .attr("y2", state.height )
        .attr("opacity", .5)
        .attr("stroke-width", 1)
        .attr("stroke", "red")

    if(jesus){
        zero.append("g")
            .attr("id", "jesusIcon")
            .attr("transform", "scale(0.4)")
            .call(drawJesus, "black")
    }
}

export function map({state, highlight, infoElements}, bars, container ){

    const map = container.append(() =>bars.clone(true).node())
        .attr("id", "minimap")
        .attr("transform", `translate(${state.navigation.x}, ${state.navigation.y}) scale(${state.navigation.scale})`)

    const hlActive_events = highlight.highlight_main && highlight.ident === "events"
    const hlActive_persons = highlight.highlight_main && highlight.ident === "persons"
    const eventHL = hlActive_events ? state.x_scale(highlight.element.datum) : 0
    const personHL = hlActive_persons ? state.y_scale(highlight.element.id) : 0

    const mapBG = map
        .append("rect")
        .attr("width", state.width).attr("height", state.height)
        .attr("fill", "white")
        .attr("stroke", "black").attr("stroke-width", 1);

    map.selectAll("text").remove()
    map.selectAll("line").remove()
    map.selectAll("rect").attr('id', null)

    map.append("rect")
        .attr("id", "mapPersonHL")
        .attr("x", 0)
        .attr("y", personHL)
        .attr("width", state.width)
        .attr("height", state.barHeight)
        .attr("fill", "cyan")
        .attr("opacity", hlActive_persons ? 0.5 : 0);

    map.append("line")
        .attr("id", "mapEventHL")
        .attr("x1", eventHL)
        .attr("x2", eventHL)
        .attr("y1", 0)
        .attr("y2", state.graph.height)
        .attr("height", state.height)
        .attr("stroke", "magenta")
        .attr("stroke-width", 2)
        .attr("opacity", hlActive_events ? 1 : 0 );

    map.append("g")
        .attr("id", "_focus")
        .append("rect").attr("x", 0).attr("y", 0)
            .attr("width", state.width).attr("height", state.height)
            .attr("fill", "none")
            .attr("stroke", "black").attr("stroke-width", state.navigation.strokeWidth);
  
    mapBG.lower();

}