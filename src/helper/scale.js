import * as d3_scale from 'd3-scale';

export function calc_xScale ({ startDate, stopDate }, width){

    return d3_scale.scaleTime()
        .domain([startDate, stopDate])
        .range([0, width])
}

export function calc_yScale (type, data, height, max){

    switch (type){
        case "linear":
            return d3_scale.scaleLinear()
                .domain([max, 0])
                .range([0, height]);
        case "band":
            return d3_scale.scaleBand()
                .domain(data.map(x=>x.order_system).reverse())
                .range([0, height]);
        default:
            break;
    }
}