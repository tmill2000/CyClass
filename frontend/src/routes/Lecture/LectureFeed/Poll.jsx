import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProfileIcon from "../../../components/ProfileIcon";
import TimeLabel from "./TimeLabel";
import PollOption from "./PollOption";
import "./styles.css";

let allowResponse = true;
const selectedCache = {};

function Poll(props) {
  const [selected, setSelected] = useState(selectedCache[props.id] || null);
  selectedCache[props.id] = selected;

  const [pollPrompt, setPollPrompt] = useState(props.prompt);
  const [pollChoices, setPollChoices] = useState(props.choices || []);
  const [hovering, setHovering] = useState(false); // New state hook for hover tracking

  useEffect(
    () => {
      if (props.api != null && props.id != null && selected == null) {
        props.api.getPollResponse(props.id).then((choice) => {
          if (choice.choiceID != null) {
            setSelected(choice.choiceID);
          }
        });
      }
    },
    [props.api, props.id, selected]
  );

  const canEditPoll = props.elevated;

  const editPollPrompt = () => {
    const updatedPrompt = prompt("Enter updated poll prompt:");
    if (updatedPrompt != null) {
        props.api.editPollPrompt(props.id, updatedPrompt)
    }
  };

  const onSelect = (choiceID) => {
    if (!props.closed && props.api != null && allowResponse) {
      allowResponse = false;
      props.api
        .respondToPoll(props.id, choiceID)
        .then(() => setSelected(choiceID))
        .finally(() => (allowResponse = true));
    }
  };

  const onClose = () => {
    if (!props.closed && props.api != null) {
      props.api.closePoll(props.id);
    }
  };

  const choices = pollChoices.sort((x, y) => x.id - y.id);

  const resultsURL = `results?poll=${props.id}`;

  const showEditButtons = hovering && props.elevated && canEditPoll && !props.closed;

  return (
    <li className={`poll ${props.me ? "me" : ""}`}
    onMouseEnter={() => setHovering(true)}
    onMouseLeave={() => setHovering(false)}>
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
                            id={x.id}
                            pollID={props.id}
                            api={props.api}
                            canEdit={canEditPoll}
                            onSelect={!props.closed ? () => onSelect(x.id) : null}
                            selected={x.id == selected}
                            correct={props.closed ? x.correct == true : null}>
                            {x.text}
                        </PollOption>)}
                    </div>
                </div>
                <div className="poll-footer">
                    {hovering && (
                    <div className="poll-buttons">
                        {canEditPoll && (
                        <button className="edit-button" onClick={editPollPrompt}>
                        Edit Prompt
                        </button>
                        )}
                    </div>
                    )}
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

return (
    <li
className={`poll ${props.me ? "me" : ""}`}
onMouseEnter={() => setHovering(true)}
onMouseLeave={() => setHovering(false)}
>
<div>
<TimeLabel time={props.time} />
<div className="post-bubble">
    <div className="poll-header">
        <h3>{pollPrompt}</h3>
        {props.creator && (
        <div className="poll-author">
            <ProfileIcon user={props.creator} />
            <span>{props.creator.username}</span>
        </div>
        )}
    </div>
    <div className="poll-choices">
        {choices.map((choice) => (
        <PollOption
        key={choice.id}
        choice={choice}
        selected={selected === choice.id}
        onSelect={onSelect}
        canEdit={showEditButtons}
        onEdit={() => editPollChoice(choice.id)}
        />
        ))}
    </div>
    <div className="poll-footer">
        {props.me && (
        <div className="poll-buttons">
            {canEditPoll && (
            <button className="edit-button" onClick={editPollPrompt}>
            Edit Prompt
            </button>
            )}
            {!props.closed && (
            <button className="close-button" onClick={onClose}>
            Close Poll
            </button>
            )}
        </div>
        )}
        <div className="poll-result-link">
            <Link className="button results" to={resultsURL}>
            VIEW PARTICIPATION</Link>
        </div>
    </div>
</div>
</div>
</li>
);
}
export default Poll;