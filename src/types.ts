export interface User {
  email: string;
  isAdmin: boolean;
}

export interface TableData {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive';
  joinDate: string;
}