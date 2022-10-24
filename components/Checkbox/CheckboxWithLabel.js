import React from "react";

const CheckboxWithLabel = ({ label }) => {
    /*
        To render the checkbox with any label of choice, simply render with:

        <div className="app">
           <Checkbox label="Subscribe to newsletter?" />
        </div>

        Making sure to import this class into the component of choice as well.
    */
    return (
      <div className="checkbox-wrapper">
        <label>
          <input type="checkbox" />
          <span>{label}</span>
        </label>
      </div>
    );
  };
  export default CheckboxWithLabel;