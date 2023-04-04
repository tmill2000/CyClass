/**
 * AUTHOR:	Adam Walters
 * CO-AUTHOR: Brandon Burt
 * CREATED:	11/06/2022
 * UPDATED:	03/27/2023, 04/02/2023
 */

 import React, { useState } from "react";
 import TimeLabel from "./TimeLabel";
 import Attachment from "./Attachment";
 import ProfileIcon from "../../../components/ProfileIcon";
 import { editMessage } from "../../../../../server/api/message/editMessage";
 import { deleteMessage } from "../../../../../server/api/message/deleteMessage";
 
 import "./styles.css";
 
 function Message(props) {
	 /** 
	  * State variables to determine when a message is being edited and track the edited text.
	 */
	 const [isEditing, setIsEditing] = useState(false);
	 const [editedText, setEditedText] = useState(props.text);
	/**
	 * isEditable is used to validate you can see the edit button when hovering on messages you sent
	 */
  	 const isEditable = props.user.id == currentUser.id;
	 const isDeletable = props.user_role === "Professor";
 
	 /** 
	  * Function that handles the editing of a message.
	  * It calls the 'onEdit' function passed down through props with the message ID and the new edited text,
	  * and sets 'isEditing' to false to exit editing mode.
	 */
	 const handleEdit = async () => {
		 try {
		   // check if the current user is the author of the message being edited
		   if (props.user.id !== currentUser.id) {
			 throw new Error('You can only edit your own messages.');
		   }
	   
		   // make the API call to update the message
		   const updatedMessage = await props.api.editMessage(props.id, editedText);
	   
		   // update the messages state with the updated message
		   setMessages(prevMessages => {
			 const updatedMessages = [...prevMessages];
			 const index = updatedMessages.findIndex(message => message.id === props.id);
			 updatedMessages[index] = updatedMessage;
			 return updatedMessages;
		   });
	   
		   // exit edit mode
		   setIsEditing(false);
		 } catch (error) {
		   console.error(error);
		 }
	   };
	   
	 /**
	  * Function that handles the deletion of a message.
	  * It calls the 'onDelete' function passed down through props with the message ID.
	  */
	  const handleDelete = () => {
		 // Only allow the user to delete their own messages
		 if (props.me || props.user?.id === currentUserId) {
		   props.api.deleteMessage(props.id).then(() => {
			 // Call the onDelete callback provided by the parent component
			 if (props.onDelete) {
			   props.onDelete(props.id);
			 }
		   });
		 } else {
		   alert("You are not authorized to delete this message.");
		 }
	   };
 
	  const handleMouseEnter = () => {
		setIsHovering(true);
	  };
 
	  const handleMouseLeave = () => {
		setIsHovering(false);
	  };
 
	  const [isHovering, setIsHovering] = useState(false);
 
	 /* OLD CODE
	 // Component
	 return (
		 <li className={`msg ${props.me ? "me" : ""}`}>
			 <div className="post-container">
				 <TimeLabel time={props.time}/>
				 <div className="post-bubble">
					 <span className="selectable">{props.text}</span>
					 {props.attachments != null && props.attachments.length > 0 ?
					 <div className="attachment-list">
						 {props.attachments.map(a => <Attachment key={a.id} api={props.api} id={a.id} type={a.type} />)}
					 </div>
					 : null}
				 </div>
			 </div>
			 {(props.user != null) ?
			 <div className="user-container">
				 <ProfileIcon profile_name={props.me ? "You" : props.user.name} profile_role={props.user.role} flipped={true} />
			 </div>
			 : null}
		 </li>
	 );
	 */
 
/**
 * This is where you conditionally see the edit button for a message, only if you are 
 */
 return (
	 <li
	   className={`msg ${props.me ? "me" : ""}`}
	   onMouseEnter={handleMouseEnter}
	   onMouseLeave={handleMouseLeave}
	 >
	   <div className="post-container">
		 <TimeLabel time={props.time} />
		 <div className="post-bubble">
		   {isEditing ? (
			 <textarea
			   value={editedText}
			   onChange={(e) => setEditedText(e.target.value)}
			 />
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
		 <div className="post-actions">
		   {isEditable && (
			 <button
			   className={isHovering ? "visible" : "hidden"}
			   onClick={() => setIsEditing(true)}
			 >
			   Edit
			 </button>
		   )}
		   {isDeletable && (
			 <button 
			 className={isHovering ? "visible" : "hidden"}
			 onClick={handleDelete}
			 >
				Delete
			 </button>
		   )}
		   {isEditing && (
			 <>
			   <button 
			   className={isHovering ? "visible" : "hidden"}
			   onClick={handleEdit}
			   >
				Save
			   </button>
			   <button 
			   className={isHovering ? "visible" : "hidden"}
			   onClick={() => setIsEditing(false)}
			   >
				Cancel
				</button>
			 </>
		   )}
		 </div>
	   </div>
	   {props.user != null ? (
		 <div className="user-container">
		   <ProfileIcon
			 profile_name={props.me ? "You" : props.user.name}
			 profile_role={props.user.role}
			 flipped={true}
		   />
		 </div>
	   ) : null}
	 </li>
   );
 }

export default Message;