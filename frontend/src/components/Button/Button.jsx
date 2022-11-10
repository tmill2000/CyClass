import React from "react";
import "./styles.css";

const STYLES = [
    "btn--post--solid",
    "btn--cancel--solid",
    "btn--newComment--solid",
    "btn--reply--solid",
    "btn--viewParticipation--solid",
    "btn--goToPost--solid",
    "btn--exportToCSV--solid",
    "btn--post--outline",
    "btn--cancel--outline",
    "btn--newComment--outline",
    "btn--reply--outline",
    "btn--viewParticipation--outline",
    "btn--goToPost--outline",
    "btn--exportToCSV--outline",
];

const SIZES = ["btn--small", "btn--medium", "btn--large"];

const Button = ({ 
    children, 
    type, 
    onClick, 
    buttonStyle, 
    buttonSize
}) => {

  const checkButtonStyle = STYLES.includes(buttonStyle)
    ? buttonStyle 
    : STYLES[0];

  const checkButtonSize = SIZES.includes(buttonSize) 
    ? buttonSize 
    : SIZES[0];

    /*
    To implement a button in the application, render the following with these props:

    <Button
    onClick={() => {
        console.log("This can be any function!");
    }}
    type="button"
    buttonStyle="btn--post--outline"
    buttonSize="btn--large"
    >
    Label
    </Button>

    **NOTE**
    Refer to the button styles sheet at ./components/Button/button.css for more info on
    what the different options look like, and to add/change any selections.
    */

    return (
        <button 
          id = "button"
          className={`btn ${checkButtonStyle} ${checkButtonSize}`} 
          onClick={onClick} 
          type={type}
        >
            {children}
        </button>
    )
};

export default Button;
