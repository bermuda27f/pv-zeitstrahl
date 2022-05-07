import React, {Fragment} from 'react';

import "../styles.css"

import { zoomToElement } from '../helper/zoom.js';
import { getElement } from '../helper/calc_set.js';

export default function PeriodeSelect(props) {

  const handleChange = (event) => {    
    const element = getElement(props.state.data.infos, "kurz", event.target.value)
    zoomToElement (props.state, "perioden", event.target.value, element)
  };

  return (
    <Fragment>
      <label htmlFor = "periods"> select period: </label>
      <select name = "periods" onChange={ handleChange }>
        <option value={"gesamt"}>entire period</option>
        <option value={"DR"}>Deutsches Reich</option>
        <option value={"KR"}>... Deutsches Kaiserreich</option>
        <option value={"WEIMAR"}>... Weimarer Republik</option>
        <option value={"NS"}>... NS-State</option>
        <option value={"BRD"}>Bundesrepublik</option>
        <option value={"BRD_1"}>... Bonner Republik</option>
        <option value={"BRD_2"}>... Berliner Republik</option>
      </select>
    </Fragment>
  );
}