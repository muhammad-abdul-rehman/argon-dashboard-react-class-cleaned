import React from 'react';
import { FormControlLabel, IconButton } from '@material-ui/core';

const MatEdit = ({ index, handleClick, handleDeleteClick }) => {
	return (
		<>
			<FormControlLabel
				control={
					<IconButton
						style={{ fontSize: '1rem' }}
						aria-label='edit membership'
						onClick={/*handleEditClick*/ handleClick}
					>
						<i className='fa fa-pen' />
					</IconButton>
				}
			/>
			<FormControlLabel
				control={
					<IconButton
						style={{ fontSize: '1rem' }}
						aria-label='delete membership'
						onClick={handleDeleteClick}
					>
						<i className='fa fa-trash' />
					</IconButton>
				}
			/>
		</>
	);
};

export default MatEdit;
