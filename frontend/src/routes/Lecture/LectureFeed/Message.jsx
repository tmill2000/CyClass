/**
 * AUTHOR:	Adam Walters
 * CREATED:	11/06/2022
 * UPDATED:	04/18/2023
 */

import React, { useState } from "react";

import ProfileIcon from "../../../components/ProfileIcon";

import TimeLabel from "./TimeLabel";
import Attachment from "./Attachment";
import EditDelete from "./EditDelete";

import "./styles.css";

function Message(props) {

	const isEditable = props.me;
	const isDeletable = props.me || props.elevated;

	const handleEdit = (updatedContent) => {
		props.api.editMessage(props.id, updatedContent);
	};
	const handleDelete = () => {
		props.api.deleteMessage(props.id);
	};

	// Component
	return (
		<li
			className={`msg ${props.me ? "me" : ""}`}>
			<div className="post-container">
				<TimeLabel time={props.time} />
				<div className="post-bubble">
					{(isEditable || isDeletable) ? (
						<EditableMessage message={props.text} canEdit={isEditable} handleDelete={handleDelete} isEditable handleEdit={handleEdit} />
					) : (
						<span className="selectable">{props.text}</span>
					)}
					{props.attachments != null && props.attachments.length > 0 ? (
						<div className="attachment-list">
							{props.attachments.map((a) => (
								<Attachment
									key={a.id}
									api={props.api}
									id={a.id}
									type={a.type}
								/>
							))}
						</div>
					) : null}
				</div>
			</div>
			{props.showUser ? (
				<div className="user-container">
					<ProfileIcon
						profile_name={props.me ? "You" : props.user.name}
						profile_role={props.user.role}
						flipped={props.me}
					/>
				</div>
			) : null}
		</li>
	);
}

function EditableMessage(props) {
	const [isEditing, setIsEditing] = useState(false);
	const [newContent, setNewContent] = useState(props.message);

	const handleEdit = () => {
		setIsEditing(false);
		props.handleEdit(newContent);
	};

	const handleDelete = () => {
		props.handleDelete();
	};

	return (
		<div>
			{isEditing ? (
				<div>
					<textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} />
					<div>
						<button className="standard button save" onClick={handleEdit}>Save</button>
						<button className="standard button cancel" onClick={() => setIsEditing(false)}>Cancel</button>
					</div>
				</div>
			) : (
				<div>
					<EditDelete canDelete={true} canEdit={props.canEdit} handleDelete={handleDelete} handleEdit={() => setIsEditing(true)} />
					<span className="editable">{props.message}</span>
				</div>
			)}
		</div>
	);
}
export default Message;