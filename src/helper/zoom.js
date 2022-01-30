import { getElement, setTimeOffset } from './calc_set.js'
import * as d3_zoom from 'd3-zoom';

export function zoomToElement ({ state }, type, key, element){

    const calcEl = () => {
        switch(type){
            case "partei":
                return {
                    start : state.data.wahlen.find((x) => { return x.ID === element.ID_Wahl_Start }).Datum,
                    end : state.data.wahlen.find((x) => { return x.ID === element.ID_Wahl_Stop }).Datum,
                    edge : { left : false, right: false }
                }
            case "perioden":
                let el_1, el_2
                switch(key){
                    case "gesamt" :
                        return { 
                            start : state.defaultValues.startDate, 
                            end : state.defaultValues.pos[1],
                            edge : { left : true, right: true }
                        }
                    case "DR" :
                        el_1 = getElement(state.data.perioden, "kurz", "KR")
                        el_2 = getElement(state.data.perioden, "kurz", "NS")
                        return { 
                            start : el_1.start,
                            end : el_2.end,
                            edge : { left : true, right: true }
                        }
                    case "BRD_2" :
                        el_1 = getElement(state.data.perioden, "kurz", "BRD_2")
                        return { 
                            start : el_1.start, 
                            end : state.defaultValues.pos[1],
                            edge : { left : false, right: true }
                        }
                    case "BRD" :
                        el_1 = getElement(state.data.perioden, "kurz", "BRD_1")
                        return { 
                            start : el_1.start, 
                            end : state.defaultValues.pos[1],
                            edge : { left : false, right: true }
                        }
                    default :
                        const _element = getElement(state.data.perioden, "kurz", key)
                        return { 
                            start : _element.start, 
                            end : _element.end,
                            edge : { left : false, right : false}
                        }
                }
            case "wahlen":
                return {
                    start : element.Datum,
                    end : element.Datum,
                    edge : { left : false, right: (key > 43) ? true : false }
                }
            default:
                break;
        }
    }
  
    const time = setTimeOffset(state, calcEl(), type)

    state.selections.mainGraph
        .transition()
            .duration(1000)
            .call(state.zoomObject.transform, d3_zoom.zoomIdentity
                .scale((state.width / (state.x_scale(time.end) - state.x_scale(time.start))))
                .translate(-state.x_scale(new Date(time.start)), 0));
}

export function initZoom(zoomGroup, zoom, zoomInfo, props){

    if(props.state.zoomObject){
        const start = new Date(zoomInfo._start_)
        const end = new Date(zoomInfo._stop_)
        zoomGroup
            .call(zoom.transform, d3_zoom.zoomIdentity
                .scale((props.state.width / (props.state.x_scale(end) - props.state.x_scale(start))))
                .translate(-props.state.x_scale(start), 0));
    }
    else{
        zoomGroup
            .call(zoom.transform, d3_zoom.zoomIdentity
                .scale(1)
                .translate(-0.000000001, 0));
    }
}