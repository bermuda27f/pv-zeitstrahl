import * as d3_scale from 'd3-scale';

export function calc_xScale (state, width){

    return d3_scale.scaleLinear([state.startDate, state.data.persons[state.data.persons.length - 1].end], [0, width])

}

export function calc_yScale (state, height){

    return d3_scale.scaleLinear([state.data.persons.length, 0],[0, height]);

}