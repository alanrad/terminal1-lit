const PROPERTY_TYPE_ICONS: Record<string, string> = {
  hotel: 'buildings',
  motel: 'house',
  apartment: 'building',
  hostel: 'houses',
};

const getPropertyIcon = (propertyType: string): string => {
  return PROPERTY_TYPE_ICONS[propertyType.toLowerCase()] ?? 'building';
};

export default getPropertyIcon;
