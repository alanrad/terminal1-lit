import { ApiService } from './api.service';
import { API_BASE_URL } from '../config';

export interface PropertyPrice {
  total: number;
  currency: string;
}

export interface Property {
  id: number;
  name: string;
  rating: number;
  propertyType: string;
  facilities: string[];
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  price: PropertyPrice;
}

export type TransformedProperty = Property & { fullAddress: string };

interface PropertiesResponse {
  data: Property[];
}

function transformData(properties: Property[]): TransformedProperty[] {
  return properties.map((property) => ({
    ...property,
    fullAddress: `${property.name}, ${property.address}, ${property.city}, ${property.state}, ${property.postcode}, ${property.country}`,
  }));
}

class PropertyService extends ApiService {
  constructor() {
    super({ baseUrl: API_BASE_URL });
  }

  async getProperties(): Promise<TransformedProperty[]> {
    const response = await this.fetch<PropertiesResponse>('/properties.json');
    return transformData(response.data);
  }
}

export default PropertyService;
