import React, { createContext, useState, useContext, useEffect } from 'react';

import { useMenu } from './menu.contexts';

const MemberContext = createContext({
	memberInfo: {},
	setMemberInfo: () => {},
	handlerReset: () => {},
});

export const MemberProvider = ({ children }) => {
	const { setBrand, setPage, setEmail } = useMenu();
	const [memberInfo, setMemberInfo] = useState({});

	const handlerReset = () => {
		setBrand('');
		setPage('');
		setEmail('');
		setMemberInfo({});
	};

	useEffect(() => {
		console.log(memberInfo);
		if (memberInfo.contracts)
			if (!Object.hasOwn(memberInfo.contracts, 'server_date'))
				for (const contract of memberInfo.contracts) {
					contract.values.orderProducts.forEach((product) => {
						if (product.name.includes('私塾方案'))
							contract.server_date = product.ended_at;
						if (product.name.includes('無限教練'))
							contract.server_date = product.ended_at;
					});
				}
	}, [memberInfo]);

	const value = {
		memberInfo,
		setMemberInfo,
		handlerReset,
	};

	return <MemberContext.Provider value={value}>{children}</MemberContext.Provider>;
};

export const useMember = () => useContext(MemberContext);
