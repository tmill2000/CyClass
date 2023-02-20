import React, { createRef } from "react";
import Popup from 'reactjs-popup';

import './style.css';

// How to use: <PopUp header="Poll Creation" trigger_button_name="Create Poll" content="INSERT CONTENT" submit_button_name="Post Poll"></PopUp>

export default (props) => (
  <Popup 
    trigger={<button className="button-LLLM-new-post">NEW POLL</button>}
    modal
    nested
  >
    {close => (
      <div className="popup">
        <button className="close" onClick={close}>&times;</button>
        <div className="header"> {props.header} </div>
        <ColoredLine color="grey" height="5"/>
        <div className="content">
          {' '}
          {props.content}
        </div>
        <div className="actions">
          <button className="button"
            onClick={() => {
              close();
            }}>{props.submit_button_name}</button>
        </div>
      </div>
    )}
    
  </Popup>
  
);

const ColoredLine = ({ color, height }) => (
  <hr
      style={{
          color: color,
          backgroundColor: color,
          height: height
      }}
  />
);
