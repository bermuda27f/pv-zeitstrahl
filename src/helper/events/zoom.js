import * as d3_zoom from 'd3-zoom';

export function zoom ({ state }, setZoom, setZOOMINFO) {

    const zoomed = (e) => {

        const t = e.transform;
        const newXScale = t.rescaleX(state.x_scale);
        const newYScale = t.rescaleY(state.y_scale);
        const rangeX = newXScale.range().map(t.invertX, t);

        const rangeWidth = (rangeX[1] - rangeX[0]) * t.k;
        const start = t.x === 0 ? rangeX[0] : t.k + (t.x / rangeX[0]);
        const stop = t.x === 0 ? rangeWidth : t.k + (t.x / rangeX[0]) + rangeWidth;

        setZoom(t)

        setZOOMINFO({
            type: "MULTIPLE",
            value: {
                scaleX : newXScale,
                scaleY : newYScale,
                focus : d3_zoom.zoomIdentity.scale(1/t.k).translate(-t.x, -t.y),
                transform : t,
                range : rangeX,
                // string format
                // _startDate: newXScale.invert(start).toLocaleDateString("en-EN", state.dateOptions),
                // _stopDate: newXScale.invert(stop).toLocaleDateString("en-EN", state.dateOptions),
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
        //.on("end", zoomEnd)
}
