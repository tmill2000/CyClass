/**
 * AUTHOR:	Adam Walters
 * CREATED:	11/06/2022
 * UPDATED:	03/27/2023
 */

import React, { useState } from "react";
import Button from "../../../components/Button/Button"
import TimeLabel from "./TimeLabel";
import Attachment from "./Attachment";
import ProfileIcon from "../../../components/ProfileIcon";
import LocalUser from '../../../utilities/model/LocalUser';
import editIcon from './icons/edit.png'
import trashIcon from './icons/trash.png'
import "./styles.css";

function Message(props) {

	const isEditable = props.user.id == LocalUser.current?.userID;

	const handleEdit = (updatedContent) => {
		props.api.editMessage(props.id, updatedContent);
	};

	const handleDelete = () => {
		props.api.deleteMessage(props.id);
	};

	// Component
	return (
		<li
			className={`msg ${props.me ? "me" : ""}`}
			onMouseEnter={() => setIsHovering(true)}
			onMouseLeave={() => setIsHovering(false)}
		>
			<div className="post-container">
				<TimeLabel time={props.time} />
				<div className="post-bubble">
					{isEditable ? (
						<EditableMessage message={props.text} handleDelete={handleDelete} isEditable handleEdit={handleEdit} />
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
			<div className="user-container">
				<ProfileIcon
					profile_name={props.me ? "You" : props.user.name}
					profile_role={props.user.role}
					flipped={props.me}
				/>
			</div>
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
					<textarea
						value={newContent}
						onChange={(e) => setNewContent(e.target.value)}
					/>
					<div>
						<Button onClick={handleEdit}>Save</Button>
						<Button onClick={() => setIsEditing(false)}>Cancel</Button>
					</div>
				</div>
			) : (
				<div>
					<div className="edit-delete" align="right">
						<img
							onClick={() => setIsEditing(true)}
							src={editIcon}
						/>
						<img
							onClick={handleDelete}
							src={trashIcon}
						/>
					</div>
					<span className="editable">{props.message}</span>
				</div>
			)}
		</div>
	);
}
export default Message;