export function simpleElements({ state, infoElements}, type){
    const t = state.transition;
    state.selections[type]
        .transition(t)
        .attr("opacity", infoElements[type] ? 1 : 0)
}

export function mapEventHL ({state}, d, active) {

    const line = state.selections.mapEventHL

    if(active){
        const x = state.x_scale(d.datum)
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
        const y = state.y_scale(d.id + 3)
        rect
            .transition()
            .attr("y", y)
    }
    rect
        .transition(100)
        .attr("opacity", active ? 0.5 : 0)

}