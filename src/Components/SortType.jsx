import React, { Fragment } from 'react';

function SortType(props) {

  const handleChange = (e) => {    
    props.setINFOELEMENTS({type : "SINGLE_VALUE", varName : "sortType" , value : e.target.value});
    console.log(e.target.value)
  }

    return (
        <Fragment>
            <input 
                type = "radio"
                id = "time"
                name = "SortType"
                value = "time"
                checked = {props.sortType === "time" ? "checked" : ""}
                onChange = { handleChange }
            />
            <label htmlFor = "time">Time</label>
            <input 
                type = "radio"
                id = "age"
                name = "SortType"
                value = "age"
                checked = {props.sortType === "age" ? "checked" : ""}
                onChange = { handleChange }
            />
            <label htmlFor = "age">Age</label>
            <input 
                type = "radio"
                id = "reign"
                name = "SortType"
                value = "reign"
                checked = {props.sortType === "reign" ? "checked" : ""}
                onChange = { handleChange }
            />
            <label htmlFor = "reign">Reign</label>
        </Fragment>
    );
  }

  export default SortType;