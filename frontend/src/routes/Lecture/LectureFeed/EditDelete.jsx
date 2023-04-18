/**
 * /**
 * AUTHOR:	Adam Walters
 * CREATED:	04/18/2023
 * UPDATED:	04/18/2023
 */

import React from "react";

import editIcon from './icons/edit.png'
import trashIcon from './icons/trash.png'
import "./styles.css";

function EditDelete(props) {

	// Component
	return (
		<div className="edit-delete">
			{props.canEdit ? <button className="button edit" onClick={props.handleEdit}><img src={editIcon} /></button> : null }
			{props.canDelete ? <button className="button delete" onClick={props.handleDelete}><img src={trashIcon} /></button> : null }
		</div>
	);

}

export default EditDelete;