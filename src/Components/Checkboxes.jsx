import React, {Fragment } from 'react';

export default function HandleCheckboxes(props) {
  
  const handleChange = (e) => {
    props.setMUTABLES({ type : "SINGLE_BOOL", varName : e.target.name });
  };

  return (
    <Fragment>
      <div style = {{ display: "flex" }}>
        <div>show elements: </div>
        <div >
          <input 
            disabled ={props.highlight.highlight_main && props.highlight.ident === "wahlen"}
            type="checkbox" 
            name = "handle_wahlen" 
            checked = {props.mutables.handle_wahlen} 
            onChange = { handleChange }/>
          <label htmlFor="handle_wahlen">elections</label>
        </div>
        <div>
          <input 
            disabled ={props.highlight.highlight_main && props.highlight.ident === "perioden"}
            type="checkbox" 
            name = "handle_perioden" 
            checked = {props.mutables.handle_perioden} 
            onChange = { handleChange }/>
          <label htmlFor="handle_perioden">periods</label>
        </div>
        <div>
          <input 
            disabled ={props.highlight.highlight_main}
            type="checkbox" 
            name = "labelPartei" 
            checked = {props.mutables.labelPartei} 
            onChange = { handleChange }/>
          <label htmlFor="labelPartei">label</label>
        </div>
      </div>
    </Fragment>
  );
}