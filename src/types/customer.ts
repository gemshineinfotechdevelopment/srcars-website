export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  email: string;
  carModels: string[];
  vehicleNumbers?: string[];
  totalVisits?: number;
  totalSpent?: string;
  tier?: string;
  lastVisit: string;
  preferredService: string;
  notes?: string;
}
