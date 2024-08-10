import React from 'react';
import { LinearProgress, Box, Typography, Alert } from '@mui/material';

export const updateProgress = (setProgress, step, total) => {
	setProgress(Math.round((step / total) * 100));
};

const ProgressBar = ({ value, loading, error, message }) => {
	return (
		<Box sx={{ width: '100%', m: 0 }}>
			<LinearProgress
				variant="determinate"
				value={value}
			/>
			<Typography
				variant="body2"
				color="textSecondary"
			>
				{value}% {loading ? ' - 正在執行中' : ' - 已完成'}
			</Typography>
			{message && (
				<Typography
					variant="body2"
					color="textSecondary"
				>
					{message}
				</Typography>
			)}
			{error && (
				<Alert
					severity="error"
					sx={{ mt: 2 }}
				>
					{error}
				</Alert>
			)}
		</Box>
	);
};

export default ProgressBar;
