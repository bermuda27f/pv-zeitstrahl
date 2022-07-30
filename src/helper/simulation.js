import * as d3_force from 'd3-force';

export function calcTicks(state, x_scale, visible){

    const simulation = d3_force.forceSimulation(visible)
        .force("x", d3_force.forceX(function(d){
            d.x = x_scale(new Date(d.datum))
            return d.x
            })
        )
        .force("y", d3_force.forceY(function(d){
            d.y = state.handle.offset
            return d.y
        }))
        .force("collision", d3_force.forceCollide()
            .strength(0.09)
            .radius(state.handle.size + 1))
            .stop()

    for(let i = 0; i < 120; i++) {
        simulation.tick()
    }

    return simulation

}