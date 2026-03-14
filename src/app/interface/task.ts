export interface Task {
  id: string;
  attributes: {
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    created_at: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}
