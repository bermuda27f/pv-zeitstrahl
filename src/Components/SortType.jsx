import React, { Fragment } from 'react';

function SortType(props) {

  const handleChange = (e) => {    
    props.setUIELEMENTS({type : "SINGLE_VALUE", varName : "sortType" , value : e.target.value});
  }

    return (
        <Fragment>
          {props.state.sortTypes.map((type) => {
            return (
              <Fragment key = { type }>
                <input 
                  type = "radio"
                  id = { type }
                  name = "SortType"
                  value = { type }
                  checked = {props.sortType === type  ? "checked" : ""}
                  onChange = { handleChange }
              />
              <label htmlFor = { type }>{ type }</label>
              </Fragment>
          )
          })}
        </Fragment>
    );
  }

  export default SortType;