import { User, UsersResponse } from '@/store/api/userApi';

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1234567891',
    status: 'active',
    createdAt: '2024-01-16T11:20:00Z',
    updatedAt: '2024-01-16T11:20:00Z',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    phone: '+1234567892',
    status: 'inactive',
    createdAt: '2024-01-17T09:15:00Z',
    updatedAt: '2024-01-17T09:15:00Z',
  },
  {
    id: '4',
    name: 'Alice Williams',
    email: 'alice.williams@example.com',
    phone: '+1234567893',
    status: 'active',
    createdAt: '2024-01-18T14:45:00Z',
    updatedAt: '2024-01-18T14:45:00Z',
  },
  {
    id: '5',
    name: 'Charlie Brown',
    email: 'charlie.brown@example.com',
    phone: '+1234567894',
    status: 'active',
    createdAt: '2024-01-19T16:30:00Z',
    updatedAt: '2024-01-19T16:30:00Z',
  },
];

// Store users in localStorage
const STORAGE_KEY = 'mock_users';

// Initialize mock data
export const initMockUsers = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUsers));
  }
};

// Get users from localStorage
export const getMockUsers = (): User[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : mockUsers;
};

// Save users to localStorage
const saveMockUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

// Mock API handlers
export const mockUserApi = {
  getUsers: (params: {
    page?: number;
    take?: number;
    search?: string;
  }): Promise<UsersResponse> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let users = getMockUsers();
        
        // Filter by search
        if (params.search) {
          const searchLower = params.search.toLowerCase();
          users = users.filter(
            (user) =>
              user.name.toLowerCase().includes(searchLower) ||
              user.email.toLowerCase().includes(searchLower)
          );
        }

        // Pagination
        const page = params.page || 1;
        const take = params.take || 10;
        const total = users.length;
        const totalPages = Math.ceil(total / take);
        const start = (page - 1) * take;
        const end = start + take;
        const paginatedUsers = users.slice(start, end);

        resolve({
          data: paginatedUsers,
          pagination: {
            total,
            currentPage: page,
            totalPages,
            hasNext: page < totalPages,
            hasPrevious: page > 1,
          },
        });
      }, 500); // Simulate network delay
    });
  },

  getUserById: (id: string): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = getMockUsers();
        const user = users.find((u) => u.id === id);
        resolve(user || null);
      }, 300);
    });
  },

  addUser: (data: Partial<User>): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = getMockUsers();
        const newUser: User = {
          id: Date.now().toString(),
          name: data.name || '',
          email: data.email || '',
          phone: data.phone,
          status: data.status || 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        users.push(newUser);
        saveMockUsers(users);
        resolve(newUser);
      }, 500);
    });
  },

  updateUser: (id: string, data: Partial<User>): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getMockUsers();
        const index = users.findIndex((u) => u.id === id);
        if (index === -1) {
          reject(new Error('User not found'));
          return;
        }
        users[index] = {
          ...users[index],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        saveMockUsers(users);
        resolve(users[index]);
      }, 500);
    });
  },

  deleteUsers: (params: {
    ids: string[];
    selectAll?: boolean;
    excludedIds?: string[];
  }): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let users = getMockUsers();
        
        if (params.selectAll) {
          // Delete all except excluded
          users = users.filter((u) => params.excludedIds?.includes(u.id));
        } else {
          // Delete specific IDs
          users = users.filter((u) => !params.ids.includes(u.id));
        }
        
        saveMockUsers(users);
        resolve();
      }, 500);
    });
  },
};

// Initialize on module load
initMockUsers();
