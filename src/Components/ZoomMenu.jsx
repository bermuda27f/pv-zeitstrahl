import React, {Fragment} from 'react';

import "../styles.css"

import * as d3_ease from 'd3-ease';
import * as d3_zoom from 'd3-zoom';

export default function ZoomMenu(props) {

    function handleZoom (symbol) {

        switch (symbol){
            case "Reset Zoom":
                props.state.selections.mainGraph
                    .transition().duration(250)                
                    .call(props.state.zoomObject.transform, d3_zoom.zoomIdentity.scale(1))
                break;
            case "+":
                props.state.selections.mainGraph
                    .transition().duration(250).ease(d3_ease.easePoly.exponent(4))
                    .call(props.state.zoomObject.scaleBy, 1.5)
                break;
            case "-":
                props.state.selections.mainGraph
                    .transition().duration(250).ease(d3_ease.easePoly.exponent(4))
                    .call(props.state.zoomObject.scaleBy, 1/1.5)
                break;
            default:
                break;
        }
    }
  return (
      <Fragment>
        <div className = "Text ButtonContainer">
            <span className = "Text menuText">zoom: </span>
            <div className = "Buttons">
                <button
                    className = "ButtonText"
                    disabled = { props.zoomInfo.transform === null ? false : props.zoomInfo.transform.k >= props.state.maxScale ? true : false }
                    onClick = {() => { handleZoom("+")}}> +
                </button>
            </div>
            <div className = "Buttons">
                <button
                    className = "ButtonText"
                    disabled = { props.zoomInfo.transform === null ? true : props.zoomInfo.transform.k === 1 ? true : false }
                    onClick = {() => { handleZoom("-")}}> -
                </button>
            </div>
            <div className = "Buttons">
                <button
                    className = "ButtonText"
                    disabled = { props.zoomInfo.transform === null ? true : props.zoomInfo.transform.k === 1 ? true : false }
                    onClick = {() => { handleZoom("Reset Zoom")}}> reset
                </button>
            </div>
        </div>
    </Fragment>
  );
}