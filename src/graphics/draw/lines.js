import * as check from  '../../helper/check.js';
import * as d3_shape from 'd3-shape';

export function curve ({ state }) {
    return d3_shape.line()
        .defined(function(d) { return check.nullHundret(d) })
            .curve(d3_shape.curveMonotoneX)
            .x(function(d) { return state.x_scale(new Date(d.Datum)); })
            .y(function(d) { return state.y_scale(d.Ergebnis); });
}