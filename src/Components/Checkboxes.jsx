import React, {Fragment } from 'react';
import "../styles.css"

export default function HandleCheckboxes(props) {
  
  const handleChange = (e) => {
    props.setINFOELEMENTS({ type : "SINGLE_BOOL", varName : e.target.name });
  };

  return (
    <Fragment>
      <div style = {{ display: "flex" }} className = "Text">
        <div>show elements: </div>
        <div >
          <input 
            disabled ={props.highlight.highlight_main}
            type="checkbox" 
            name = "events" 
            checked = {props.infoElements.events} 
            onChange = { handleChange }/>
          <label htmlFor="events">events</label>
        </div>
        <div>
          <input 
            disabled ={props.highlight.highlight_main}
            type="checkbox" 
            name = "label" 
            checked = {props.infoElements.label} 
            onChange = { handleChange }/>
          <label htmlFor="label">label</label>
        </div>
        <div>
          <input 
            disabled ={ false }
            type="checkbox" 
            name = "map" 
            checked = {props.infoElements.map} 
            onChange = { handleChange }/>
          <label htmlFor="map">map</label>
        </div>
      </div>
    </Fragment>
  );
}