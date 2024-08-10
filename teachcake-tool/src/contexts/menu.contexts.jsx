import React, { createContext, useState, useContext } from 'react';
import brands from '../brands';

const MenuContext = createContext({
	brand: '',
	setBrand: () => {},
	page: '',
	setPage: () => {},
	email: '',
	setEmail: () => {},
	menu: [],
});

export const MenuProvider = ({ children }) => {
	const [brand, setBrand] = useState('');
	const [page, setPage] = useState('');
	const [email, setEmail] = useState('');
	const menus = [
		{
			id: 'brands',
			name: '品牌',
			input_type: 'select',
			value: brand,
			onchange: setBrand,
			data: brands.map((brand) => ({ id: brand.id, name: brand.name })),
		},
		{
			id: 'pages',
			name: '執行項目',
			input_type: 'select',
			value: page,
			onchange: setPage,
			data: [
				{
					id: 'adjustOrder',
					name: '修改訂單',
				},
				{
					id: 'leave',
					name: '請假',
				},
				{
					id: 'extension',
					name: '展延',
				},
			],
		},
		{
			id: 'mail',
			name: '信箱',
			input_type: 'text',
			value: email,
			onchange: setEmail,
		},
	];
	const value = {
		brand,
		setBrand,
		page,
		setPage,
		email,
		setEmail,
		menus,
	};
	return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export const useMenu = () => useContext(MenuContext);
