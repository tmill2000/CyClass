/**
 * AUTHOR:	Adam Walters
 * CREATED:	11/06/2022
 * UPDATED:	03/27/2023
 */

 import React, { useState } from "react";
 import TimeLabel from "./TimeLabel";
 import Attachment from "./Attachment";
 import ProfileIcon from "../../../components/ProfileIcon";
 import LocalUser from '../../../utilities/model/LocalUser';
 import LiveLectureAPI from '../../../utilities/api/LiveLectureAPI';
 import "./styles.css";
 
 function Message(props) {

   const [isHovering, setIsHovering] = useState(false);
   const [showActions, setShowActions] = useState(false);
 
   const isEditable = user && LocalUser.id === user.id;
 
   const handleEdit = (updatedContent) => {
	 LiveLectureAPI.editMessage(props.messageId, props.updatedContent)
	   .then((res) => {
		this.websocket.send(JSON.stringify({
			type: "message",
			payload: {
				sender_id: this.userID,
				body: body,
				is_anonymous: anonymous,
				course_id: this.courseID,
				lecture_id: this.lectureID,
				parent_id: null
			}
		}));
	   })
	   .catch((err) => {
		 console.error("Failed to edit message", err);
		 throw err;
	   });
   };
 
   const handleDelete = () => {
	 LiveLectureAPI.deleteMessage(props.messageId, props.courseId)
	   .then((res) => {
		if (this.websocket != null) {
			this.websocket.send(JSON.stringify({
				type: "delete_message",
				payload: {
					course_id: courseId
				}
			}));
		}
		// Refresh message list after deletion
		 props.refreshMessages();
	   })
	   .catch((err) => {
		 console.error("Failed to delete message", err);
		 throw err;
	   });
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
			 <EditableMessage message={message} handleEdit={handleEdit} />
		   ) : (
			 <span className="selectable">{message}</span>
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
	   {user != null ? (
		 <div
		   className="user-container"
		   onMouseEnter={() => setShowActions(true)}
		   onMouseLeave={() => setShowActions(false)}
		 >
		   <ProfileIcon
			 profile_name={props.me ? "You" : user.name}
			 profile_role={user.role}
			 flipped={props.me}
		   />
		   {isEditable && isHovering && showActions ? (
			 <div className="message-actions">
			   <button onClick={handleDelete}>Delete</button>
			   <button onClick={() => setIsEditing(true)}>Edit</button>
			 </div>
		   ) : null}
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
 
   return (
	 <div>
	   {isEditing ? (
		 <div>
		   <textarea
			 value={newContent}
			 onChange={(e) => setNewContent(e.target.value)}
		   />
		   <button onClick={handleEdit}>Save</button>
		   <button onClick={() => setIsEditing(false)}>Cancel</button>
		 </div>
	   ) : (
		 <span className="editable" onClick={() => setIsEditing(true)}>
		   {props.message}
		 </span>
	   )}
	 </div>
   );
 }
 export default Message;