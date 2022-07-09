import { calc_xScale, calc_yScale } from './scale.js';

import * as d3_axis from 'd3-axis';
import * as d3_format from 'd3-format'

export function getPatterns(type){

    switch(type){
        case "krieg" : return 'url(#hatching)';
        case "phase" : return 'url(#circlePattern)';
        case "highlight" : return 'url(#highlight_pattern)';
        default: return "url(#circlePattern_wide)";
    }
}

export function getElement (y, key_type, key) {
  return y.find((x)=> {
      return x[key_type] === key;
  })
}

export function setTimeOffset (state, element, type ){

  let margin = null

  switch(type){
    case "wahlen":
      margin = state.timeMargin.wahlen;
      break;
    default:
      margin = state.timeMargin.normal
      break;
    
  }

  const _startDate = new Date(element.start)
  const _endDate = new Date(element.end)
  
  return { 
    start :_startDate.setDate(_startDate.getDate() - (element.edge.left ? 0 : margin)),
    end : _endDate.setDate(_endDate.getDate() + (element.edge.right && type === "wahlen" ? state.timeMargin.wahlenEdge : element.edge.right ? 0 : margin))
  }
}

export function size(state){

  const navScale = 0.25;
  const marginNav = 5

  const width = state.mainRef.current.clientWidth - state.margin.left - state.margin.right
  const clientWidth = state.mainRef.current.clientWidth

  const graph_ratio = 0.45;
  const tickNumber = 6

  const height = width * graph_ratio;

  const x_scale = calc_xScale(state, width);
  const y_scale = calc_yScale(state, height);

  return {

    mainRefSize : clientWidth,

    x_scale : x_scale,
    y_scale : y_scale,

    x_axis : d3_axis.axisBottom(x_scale)
      .ticks(tickNumber)
      .tickFormat(d3_format.format(3)),
    x_axis_lines : d3_axis.axisBottom(x_scale)
      .ticks(tickNumber)
      .tickFormat(d3_format.format(3))
      .tickSize(height),

    width : width,
    height : height,

    mainGraphHeight : height + state.margin.top + state.margin.bottom + state.handle.offset + (2 * state.handle.size),

    barHeight : (height - state.margin.bottom) / state.data.kaiser.map(x=>x.id).length,

    graph : { 
      x : state.margin.left,
      y : state.margin.top,
      height: height,
    },

    tickNumber : tickNumber,

    navigation : {
      x : width - (width * navScale) - marginNav,
      y : height - (height * navScale) - marginNav,
      scale : navScale, 
      strokeWidth : 2
    },

    startDate : state.startDate,
    stopDate : state.endDate
  }
}


export function dauer (zoomInfo) {
  const zeit = new Date(zoomInfo._start_).getFullYear() - new Date(zoomInfo._stop_).getFullYear() 
  const _zeit = zeit === 0 ? "under 1 year" : -zeit + " years"
  return _zeit
}

export function zeit (props, zoomInfo) { 
  const noZoom = props.state.zoomObject === null || (zoomInfo.zoomState ? zoomInfo.zoomState.k === 1 : true)
  const start = noZoom ? new Date(props.state.startDate).toLocaleDateString("en-EN", props.state.dateOptions) + " - " : zoomInfo._startDate + " - "
  const bis = noZoom ? new Date(props.state.stopDate).toLocaleDateString("en-EN", props.state.dateOptions) : zoomInfo._stopDate
  return (start + bis)
}