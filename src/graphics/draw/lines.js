import * as check from  '../../helper/check.js';
import * as d3_shape from 'd3-shape';

export function curve (props) {
    return d3_shape.line()
        .defined(function(d) { return check.nullHundret(d) })
            .curve(d3_shape.curveMonotoneX)
            .x(function(d) { return props.state.x_scale(new Date(d.Datum)); })
            .y(function(d) { return props.state.y_scale(d.Ergebnis); });
}