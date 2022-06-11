import { calc_xScale, calc_yScale } from './scale.js';

import * as d3_axis from 'd3-axis';
import * as d3_time from 'd3-time';
import * as d3_timeFormat from 'd3-time-format';

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

export function setTime (date){

  const locale = d3_timeFormat.timeFormatLocale({
    dateTime : "%A, %e %B %Y г. %X",
    date : "%d.%m.%Y",
    time : "%H:%M:%S",
    periods : ["AM", "PM"],
    days : ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
    shortDays : ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."],
    months : ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    shortMonths : ["Jan.", "Feb.", "Mrz.", "Apr.", "Mai", "Jun.", "Jul.", "Aug.", "Sept.", "Okt.", "Nov.", "Dez."]
  });

  const formatMillisecond = locale.format(".%L"),
  formatSecond = locale.format(":%S"),
  formatMinute = locale.format("%I:%M"),
  formatHour = locale.format("%I %p"),
  formatDay = locale.format("%a %d"),
  formatWeek = locale.format("%b %d"),
  formatMonth = locale.format("%B"),
  formatYear = locale.format("%Y");

  return (
      d3_time.timeSecond(date) < date ? formatMillisecond
    : d3_time.timeMinute(date) < date ? formatSecond
    : d3_time.timeHour(date) < date ? formatMinute
    : d3_time.timeDay(date) < date ? formatHour
    : d3_time.timeMonth(date) < date ? (d3_time.timeWeek(date) < date ? formatDay : formatWeek)
    : d3_time.timeYear(date) < date ? formatMonth
    : formatYear)(date);

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

  const handleSize = 15;
  const handleOffset = 27;
  const handleBottom = 7;

  const navScale = 0.25;
  const marginNav = 5

  const width = state.mainRef.current.clientWidth - state.margin.left - state.margin.right
  const clientWidth = state.mainRef.current.clientWidth

  const graph_ratio = state.mainRef.current.clientWidth > state.breakpoint ? 0.4 : 0.45;
  const tickNumber = state.mainRef.current.clientWidth > state.breakpoint ? 10 : 5

  const height = width * graph_ratio;

  const y_scale = calc_yScale("linear", null, height, 52);
  const x_scale = calc_xScale(state, width);

  return {

    mainRefSize : clientWidth,

    x_scale : x_scale,
    y_scale : y_scale,

    x_axis : d3_axis.axisBottom(x_scale)
      .ticks(tickNumber)
      .tickFormat(setTime),
    x_axis_lines : d3_axis.axisBottom(x_scale)
      .ticks(tickNumber)
      .tickFormat(setTime)
      .tickSize(height),

    y_axis : d3_axis.axisLeft(y_scale).ticks(5),
    y_axis_lines : d3_axis.axisLeft(y_scale).ticks(5).tickSize(width),

    width : width,

    mainGraphHeight : height + state.margin.top + state.margin.bottom + handleOffset + handleSize + handleBottom,

    graph : { 
      x : state.margin.left,
      y : state.margin.top,
      height: height,
    },

    handle : {

      size : handleSize,
      offset : handleOffset,
      marginBottom : handleBottom

    },

    tickNumber : tickNumber,

    navigation : {
      x : state.margin.left,
      y : marginNav.top,
      height: navHeight
    },

    jetzt : {
      y : state.margin.top + jetztOffset
    }
  }
}


export function dauer (zoomInfo) {
  const zeit = new Date(zoomInfo._start_).getFullYear() - new Date(zoomInfo._stop_).getFullYear() 
  const _zeit = zeit === 0 ? "under 1 year" : -zeit + " years"
  return _zeit
}

export function zeit (props, zoomInfo) { 
  const noZoom = props.state.zoomObject === null || (zoomInfo.zoomState ? zoomInfo.zoomState.k === 1 : true)
  const start = noZoom ? new Date(props.state.defaultValues.startDate).toLocaleDateString("en-EN", props.state.dateOptions) + " - " : zoomInfo._startDate + " - "
  const bis = noZoom ? new Date(props.state.defaultValues.stopDate).toLocaleDateString("en-EN", props.state.dateOptions) : zoomInfo._stopDate
  return (start + bis)
}