import * as d3_zoom from 'd3-zoom';
import * as d3_brush from 'd3-brush';

export function zoom ({ state }, setZoom, setZOOMINFO) {

    const zoomed = (e) => {
        if(e === undefined || e.sourceEvent === undefined || (e.sourceEvent && e.sourceEvent.type === "brush")) return;
        setZoom(e.transform)
    }

    const zoomEnd = (e) => {

        const t = e.transform;
        const newXScale = t.rescaleX(state.x_scale);
        const range = newXScale.range().map(t.invertX, t);
        const rangeWidth = (range[1] - range[0]) * t.k;
        const start = t.x === 0 ? range[0] : t.k + (t.x / range[0]);
        const stop = t.x === 0 ? rangeWidth : t.k + (t.x / range[0]) + rangeWidth;

        setZOOMINFO({
            type: "MULTIPLE",
            value: {
                zoomScale : newXScale,
                zoomState : t,
                range : range,
                // string format
                _startDate: newXScale.invert(start).toLocaleDateString("en-EN", state.dateOptions),
                _stopDate: newXScale.invert(stop).toLocaleDateString("en-EN", state.dateOptions),
                // string normal
                _start_: newXScale.invert(start),
                _stop_: newXScale.invert(stop),
            }
        });
    }
  
    return d3_zoom.zoom()
        .scaleExtent([1, state.maxScale])
        .extent([[0, 0], [state.width, state.graph.height]])
        .translateExtent([[0, 0], [state.width, state.graph.height]])
        .on("zoom", zoomed)
        .on("end", zoomEnd)
}

export function brush ({ state }, setBrush) {

    const brushed = (e) => {
        if (e === undefined || e.sourceEvent === undefined || (e.sourceEvent && e.sourceEvent.type === "zoom")) return;
        const k = state.width / (e.selection[1] - e.selection[0]);
        const x = -e.selection[0];
        setBrush({k : k, x : x, y : 0});
    }

    return d3_brush.brushX()
        .extent([[0, 0], [state.width, state.navigation.height]])
        .on("brush", brushed);
}

