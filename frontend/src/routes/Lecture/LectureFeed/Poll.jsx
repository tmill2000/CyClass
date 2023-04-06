/**
 * AUTHOR:	Adam Walters
 * CREATED:	02/05/2023
 * UPDATED:	02/21/2023
 */

 import React, { useEffect, useState } from "react";
 import { Link } from "react-router-dom";
 
 import ProfileIcon from "../../../components/ProfileIcon";
 
 import TimeLabel from "./TimeLabel";
 import PollOption from "./PollOption";
 
 import "./styles.css";
 
 let allowResponse = true;
 const selectedCache = {};
 
 function Poll(props) {
	 // Define selected state
	 const [selected, setSelected] = useState(selectedCache[props.id] || null);
	 selectedCache[props.id] = selected
 
	 // Define interaction functions
	 const onSelect = (choiceID) => {
		 // If open and not already responding, send response
		 if (!props.closed && props.api != null && allowResponse) {
			 allowResponse = false;
			 props.api.respondToPoll(props.id, choiceID)
				 .then(() => setSelected(choiceID))
				 .finally(() => allowResponse = true);
		 }
	 };
	 const onClose = () => {
		 // If open, then close the poll
		 if (!props.closed && props.api != null) {
			 props.api.closePoll(props.id);
		 }
	 };
 
	 // Lazy-retrieve user's selection
	 useEffect(() => {
		 if (props.api != null && props.id != null && selected == null) {
			 props.api.getPollResponse(props.id)
				 .then((choice) => {
					 if (choice.choiceID != null) {
						 setSelected(choice.choiceID);
					 }
				 });
		 }
	 }, [ props.id, props.closed ]);
 
	 // Sort choices by ID
	 const choices = (props.choices || {}).map(x => x).sort((x, y) => x.id - y.id);
 
	 // Make URL for results
	 const resultsURL = `results?poll=${props.id}`;
 
	 // Component
	 return (
		 <li className={`poll ${props.me ? "me" : ""}`}>
			 <div>
				 <TimeLabel time={props.time}/>
				 <div className="post-bubble">
					 <div className="poll-header">
						 <div className="title-container">
							 <div className="container">
								 <span className="title">POLL{props.closed ? " (closed)" : ""}</span>
							 </div>
							 <div className="line" />
						 </div>
						 {!props.closed && props.elevated ? <button className="button close" onClick={onClose}>CLOSE</button> : null}
						 {props.elevated ? <Link className="button results" to={resultsURL}>VIEW PARTICIPATION</Link> : null}
					 </div>
					 <div className="content">
						 <p>{props.prompt}</p>
						 <div>
							 {choices.map(x => <PollOption key={x.id.toString()}
								 onSelect={!props.closed ? () => onSelect(x.id) : null}
								 selected={x.id == selected}
								 correct={props.closed ? x.correct == true : null}>
								 {x.text}
							 </PollOption>)}
						 </div>
					 </div>
				 </div>
			 </div>
			 {(props.user != null) ?
			 <div className="user-container">
				 <ProfileIcon profile_name={props.me ? "You" : props.user.name} profile_role={props.user.role} flipped={true} />
			 </div>
			 : null}
		 </li>
	 );
 }
 
 export default Poll; 