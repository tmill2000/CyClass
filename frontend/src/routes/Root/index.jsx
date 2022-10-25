/**
 * AUTHOR:	Adam Walters
 * CREATED:	10/24/2022
 * UPDATED:	10/24/2022
 */

 import React from "react";
 import Button from "../../components/Button/index";

 function Root(props) {
	
	return (
		<div>
			<h1>Title Text</h1>
			<Button
    			onClick={() => {
       				 console.log("This can be any function!");
    			}}
   				type="button"
    			buttonStyle="btn--post--outline"
    			buttonSize="btn--large"
    		>
			POST
   			 </Button>
		</div>

	
	);

 }

 export default Root;