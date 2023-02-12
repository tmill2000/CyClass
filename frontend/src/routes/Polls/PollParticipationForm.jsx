/**
 * AUTHOR:	Brandon Burt
 * CREATED:	02/05/2023
 * UPDATED:	02/11/2023
 */
 import React from 'react';
 import "./styles.css";


 function ParticipationForm (props) {

	// Component
	return (
        <div className="white-container">
        <div style="float: left; width: 50%;">
           <div className="header" style=" font-weight: bold; font-size: 27px; font-family: Arial; padding-left: 15px; padding-top: 9px;float:left;">Poll Participation</div>
           <div style="font-weight: bold; font-family: Arial; color: gray; text-align: left; padding-top: 47px; padding-left: 15px;">329 participants</div>
        </div>
        <div style="float: right; padding-top: 7px;width: 35px;">
           <a href="#" class="close-button">
              <div class="in">
                 <div class="close-button-block"></div>
                 <div class="close-button-block"></div>
              </div>
              <div class="out">
                 <div class="close-button-block"></div>
                 <div class="close-button-block"></div>
              </div>
           </a>
        </div>
        <div style="padding-top: 82px;">
           <div style="border-top: 1px solid gray;"></div>
        </div>
     </div>
	);

}

export default ParticipationForm;