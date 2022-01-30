import React, {Fragment} from 'react';

import { zoomToElement } from '../helper/zoom.js';
import { getElement } from '../helper/calc_set.js';

export default function PeriodeSelect(props) {

  const handleChange = (event) => {    
    const element = getElement(props.state.data.infos, "kurz", event.target.value)
    zoomToElement (props, "perioden", event.target.value, element)
  };

  return (
    <Fragment>
      <select name = "periods" onChange={ handleChange }>
        <option value={"gesamt"}>Gesamte Zeit</option>
        <option value={"DR"}>Deutsches Reich</option>
        <option value={"KR"}>... Deutsches Kaiserreich</option>
        <option value={"WEIMAR"}>... Weimarer Republik</option>
        <option value={"NS"}>... NS-Staat</option>
        <option value={"BRD"}>Bundesrepublik</option>
        <option value={"BRD_1"}>... Bonner Republik</option>
        <option value={"BRD_2"}>... Berliner Republik</option>
      </select>
      <label htmlFor = "periods"> select period </label>
    </Fragment>
  );
}