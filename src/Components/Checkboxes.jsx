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
            disabled ={props.highlight.highlight_main && props.highlight.ident === "wahlen"}
            type="checkbox" 
            name = "handle_wahlen" 
            checked = {props.infoElements.handle_wahlen} 
            onChange = { handleChange }/>
          <label htmlFor="handle_wahlen">events</label>
        </div>
        <div>
          <input 
            disabled ={props.highlight.highlight_main}
            type="checkbox" 
            name = "labelPartei" 
            checked = {props.infoElements.labelPartei} 
            onChange = { handleChange }/>
          <label htmlFor="labelPartei">label</label>
        </div>
      </div>
    </Fragment>
  );
}