import React, { Fragment } from 'react';
import { InputLabel, FormControl, MenuItem, Select, OutlinedInput } from '@mui/material';

const SelectInput = ({ menu }) => {
	const { id, name, value, data, onchange } = menu;
	const handleChange = (event) => {
		onchange(event.target.value);
	};
	return (
		<Fragment>
			<InputLabel id={`${id}-label`}>{name}</InputLabel>
			<Select
				labelId={`${id}-label`}
				id={id}
				name={id}
				value={value}
				label={name}
				onChange={handleChange}
			>
				{data.map(({ id, name }) => (
					<MenuItem
						value={id}
						key={id}
					>
						{name}
					</MenuItem>
				))}
			</Select>
		</Fragment>
	);
};

const TextInput = ({ menu }) => {
	const { id, name, value, input_type, onchange } = menu;
	const handleChange = (event) => {
		onchange(event.target.value);
	};
	return (
		<Fragment>
			<InputLabel htmlFor={id}>{name}</InputLabel>
			<OutlinedInput
				id={id}
				type={input_type}
				label={name}
				name={id}
				value={value}
				variant="outlined"
				onChange={handleChange}
			/>
		</Fragment>
	);
};

const FormControlComponents = ({ menus }) => {
	return (
		<Fragment>
			{menus.map((menu) => {
				const option = {
					sx: { width: 200, m: 1 },
					required: true,
				};
				if (menu.input_type === 'select') {
					return (
						<FormControl
							key={menu.id}
							{...option}
						>
							<SelectInput menu={menu} />
						</FormControl>
					);
				}
				if (menu.input_type === 'text') {
					return (
						<FormControl
							key={menu.id}
							{...option}
						>
							<TextInput menu={menu} />
						</FormControl>
					);
				}
				return null;
			})}
		</Fragment>
	);
};

export default FormControlComponents;
