/**
 * AUTHOR:	Adam Walters
 * CO-AUTHOR: Brandon Burt
 * CREATED:	02/05/2023
 * UPDATED:	02/21/2023, 04/02/2023
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
  selectedCache[props.id] = selected;

  // Define prompt state and handler
  const [prompt, setPrompt] = useState(props.prompt || "");
  const [isEditingPrompt, setIsEditingPrompt] = useState(false);

  const handlePromptChange = async (newPrompt) => {
    try {
      // make the API call to update the poll prompt
      const updatedPoll = await props.api.updatePoll(props.id, { prompt: newPrompt });

      // update the poll state with the updated poll
      setPrompt(updatedPoll.prompt);

      // exit edit mode
      setIsEditingPrompt(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Define choices state and handler
  const [choice, setChoices] = useState(props.choices || []);

  const handleChoicesChange = async (newChoices) => {
    try {
      // make the API call to update the poll choices
      const updatedPoll = await props.api.updatePoll(props.id, { choice: newChoices });

      // update the poll state with the updated poll
      setChoices(updatedPoll.choice);
    } catch (error) {
      console.error(error);
    }
  };

  // Define onSave function
  const onSave = () => {
    props.api.updatePoll(props.id, {
      prompt,
      choice,
    });
  };

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

  // Only allow the user who created the poll to edit the poll (Only professors can make polls so students can't edit them)
  const allowEdit = props.user_role === "Professor";

  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    if (props.me && props.user.role === "professor") {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };


  // Sort choices by ID
  const choices = (props.choices || {}).map(x => x).sort((x, y) => x.id - y.id);

  // Make URL for results
  const resultsURL = `results?poll=${props.id}`;

/** OLD CODE
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
 */

// Component
return (
	<li 
		className={`poll ${props.me ? "me" : ""}`}
		onMouseEnter={handleMouseEnter}
		onMouseLeave={handleMouseLeave}
	>
	{props.me && isHovering && allowEdit && isEditingPrompt && (
				<div className="edit-buttons">
					<Link to={`/edit/poll/${props.id}`} className="edit-button">
							<i className="fas fa-edit"></i>
					</Link>
					<button className="close-button" onClick={onClose}>
							<i className="fas fa-times"></i>
					</button>
				</div>
		)}
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
							correct={props.closed ? x.correct == true : null}
							allowEdit={allowEdit}
							handleChoicesChange={handleChoicesChange}
							handlePromptChange={handlePromptChange}
							onSave={onSave}>
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