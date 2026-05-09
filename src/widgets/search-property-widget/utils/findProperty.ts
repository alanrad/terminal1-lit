import type { TransformedProperty } from "@services/property.service";

export function findProperty(
	properties: TransformedProperty[],
	searchInput: string,
): TransformedProperty[] {
	const search = searchInput.toLowerCase();

	return properties.filter((p) => p.fullAddress.toLowerCase().includes(search));
}
