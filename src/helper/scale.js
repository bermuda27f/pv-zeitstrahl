import * as d3_scale from 'd3-scale';

export function time (state, width){
    return d3_scale.scaleTime()
        .domain([state.startDate, state.stopDate])
        .range([0, width])
}

export function linear ({min, max, start, end}){
    return d3_scale.scaleLinear([min, max],[start, end]);
}