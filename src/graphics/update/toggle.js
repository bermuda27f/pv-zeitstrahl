import * as d3_select from 'd3-selection';
import * as _tooltip from '../draw/tooltips.js'

export function elementOpacity({ state, uiElements}, type){
    const t = state.transition;
    state.selections[type]
        .transition(t)
        .attr("opacity", uiElements[type] ? 1 : 0)
}

export function mapEventHL ({state}, d, active) {

    const line = state.selections.mapEventHL

    if(active){
        const x = state.x_scale(new Date(d.datum))
        line
            .transition()
            .attr("x1", x)
            .attr("x2", x)
    }
    line
        .transition(100)
        .attr("opacity", active ? 1 : 0)

}

export function mapPersonHL ({state}, d, active) {

    const rect = state.selections.mapPersonHL

    if(active){
        const y = state.y_scale(d.id)
        rect
            .transition()
            .attr("y", y)
    }
    rect
        .transition(100)
        .attr("opacity", active ? 0.5 : 0)

}

export function eventElement({state}, key, on) {

    const el = state.selections.events.select("#img_node_" + key)
    const circle = el.select("circle");
    const lineEl = state.selections.container.select("#eventLine_" + key);
    const lineEl_lines = lineEl.selectAll("line");
    const lineEl_circle = lineEl.select("circle");

    circle.attr("stroke", on ? state.highlightColor : state.standardColor)
        .attr("stroke-width", on ? state.handle.lineWidth.highlight : state.handle.lineWidth.normal);
    lineEl_lines.attr("stroke", on ? state.highlightColor : state.standardColor)
        .attr("opacity", on ? 1 : state.handle.opacity)
        .attr("stroke-width", on ? state.handle.lineWidth.highlight : state.handle.lineWidth.normal);
    lineEl_circle.attr("stroke", on ? state.highlightColor : state.standardColor)
        .attr("opacity", on ? 1 : state.handle.opacity)
        .attr("fill", on ? state.highlightColor : state.standardColor);

}

export function person({state}, id, on) {

    const el = state.selections.personHL.select("rect")

    el.transition(state.transition)
        .attr("y", state.y_scale(id))
        .attr("opacity", on ? 1 : 0)
}

export function tooltip(props, active){

    if(active){

        const { key, e, d } = props.mouseEvents

        if(!props.highlight.highlight_main || key !== props.highlight.key){
            if(e && e.type !== "click" && !props.state.isTouch) {
                _tooltip.build(props, e, d, "name");
            }
        }
    }
    else {
        d3_select.selectAll(".tooltip_container")
        .transition()		
            .duration(20)		
            .style("opacity", 0)
                .remove();
    }
}