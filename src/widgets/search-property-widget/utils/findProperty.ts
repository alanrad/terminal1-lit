import type { TransformedProperty } from '@services/property.service';

const findProperty = (
	properties: TransformedProperty[],
	searchInput: string,
): TransformedProperty[] => {
	const search = searchInput.toLowerCase();
	return properties.filter(
		(property) => property.fullAddress.toLowerCase().includes(search),
	);
};

export default findProperty;
