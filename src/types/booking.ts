export type BookingStatus = 'Pending' | 'Confirmed' | 'In Bay' | 'Completed' | 'Cancelled';

export interface BookingRecord {
  id: string;
  customerName: string;
  phone: string;
  carModel: string;
  vehicleNumber?: string;
  service: string;
  date: string;
  status: BookingStatus;
  notes?: string;
  price?: string;
  studio?: string;
  createdAt: string;
}
