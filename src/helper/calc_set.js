import * as scale from './scale.js';

import * as d3_axis from 'd3-axis';
import * as d3_format from 'd3-format'
import * as d3_array from 'd3-array';
import * as d3_timeFormat from 'd3-time-format'
import * as d3_time from 'd3-time'

import * as bars from  '../graphics/draw/bars.js';

export function barWidth (state, start, end) { 
  return state.x_scale(new Date(end)) - state.x_scale(new Date(start)); 
  }

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

export function setTimeFormat (date){

  const locale = d3_timeFormat.timeFormatLocale({
    "dateTime": "%A, %e %B %Y г. %X",
    "date": "%d.%m.%Y",
    "time": "%H:%M:%S",
    "periods": ["AM", "PM"],
    "days": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
    "shortDays": ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."],
    "months": ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
    "shortMonths": ["Jan.", "Feb.", "Mrz.", "Apr.", "Mai", "Jun.", "Jul.", "Aug.", "Sept.", "Okt.", "Nov.", "Dez."]
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

export function dateBoundaries(data){
  const copy = JSON.parse(JSON.stringify(data))
  return {
    start : copy.sort((a,b) => { return d3_array.ascending(new Date(a.start), new Date(b.start)) })[0].start,
    stop : copy.sort((a,b) => { return d3_array.descending(new Date(a.end), new Date(b.end)) })[0].end
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

  const x_scale = scale.time(state, width);
  //const x_scale_linear = scale.linear(state.data.persons, width);
  const y_scale = scale.linear({ min : state.data.persons.length, max : 0, start : 0, end : height});

  const barHeight = (height - state.margin.bottom) / state.data.persons.map(x => x.id).length

  const calcTextOffset = bars.dummys({...state, barHeight : barHeight, width : width, height : height }, x_scale, state.mainRef.current)

  return {

    mainRefSize : clientWidth,

    x_scale : x_scale.domain([calcTextOffset.result, new Date(state.stopDate)]),
    y_scale : y_scale,

    // setTimeFormat!

    x_axis : d3_axis.axisBottom(x_scale)
      .ticks(tickNumber)
      .tickFormat(setTimeFormat),
    x_axis_lines : d3_axis.axisBottom(x_scale)
      .ticks(tickNumber)
      .tickSize(height),

    width : width,
    height : height,

    mainGraphHeight : height + state.margin.top + state.margin.bottom + state.handle.offset + (2 * state.handle.size),

    barHeight : barHeight,

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

export function order (props, _key){

    const el = props.state.selections.events.select("#img_node_" + _key)
    const oldOrder = el.data()[0].order
    el.raise();

    const tmpArray = props.state.data.events
        .map((event, i) => {
            if(event.order < oldOrder){
                return { ...event, order : event.order + 1 }
            }
            else if(event.order === oldOrder ){
                return { ...event, order : 0 }
            }
            else { return { ...event } }
        }).sort((a,b) => { return d3_array.descending(a.order, b.order) })

    const newData = {
        ...props.state.data,
        events : tmpArray,
    }

    props.setState({
        ...props.state,
        data : newData
    })
}