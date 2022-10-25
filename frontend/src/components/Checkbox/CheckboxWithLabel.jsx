import React from "react";

const Checkbox = ({ label }) => {
    /*
        To render the checkbox with any label of choice, simply render with:

        <div className="app">
           <Checkbox label="Subscribe to newsletter?" />
        </div>

        Making sure to import this class into the component of choice as well.
    */
    return (
      <div id="checkbox" className="checkbox-wrapper">
        <label>
          <input type="checkbox" />
          <span>{label}</span>
        </label>
      </div>
    );
  };
  export default Checkbox;