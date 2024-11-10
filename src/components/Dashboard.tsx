import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { TableData } from '../types';
import { LogOut, Plus, Pencil, Trash2, Check, X } from 'lucide-react';

const initialData: TableData[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Developer',
    department: 'Engineering',
    status: 'active',
    joinDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'Designer',
    department: 'Design',
    status: 'active',
    joinDate: '2024-02-01',
  },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [data, setData] = useState<TableData[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState<Partial<TableData>>({});

  useEffect(() => {
    const storedData = localStorage.getItem('tableData');
    if (storedData) {
      setData(JSON.parse(storedData));
    } else {
      setData(initialData);
      localStorage.setItem('tableData', JSON.stringify(initialData));
    }
  }, []);

  const saveData = (newData: TableData[]) => {
    setData(newData);
    localStorage.setItem('tableData', JSON.stringify(newData));
  };

  const handleAdd = () => {
    if (isAdding && newEntry.name && newEntry.email) {
      const newItem: TableData = {
        id: Date.now().toString(),
        name: newEntry.name || '',
        email: newEntry.email || '',
        role: newEntry.role || '',
        department: newEntry.department || '',
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
      };
      saveData([...data, newItem]);
      setIsAdding(false);
      setNewEntry({});
    } else {
      setIsAdding(true);
    }
  };

  const handleDelete = (id: string) => {
    saveData(data.filter((item) => item.id !== id));
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    const item = data.find((d) => d.id === id);
    if (item) {
      setNewEntry(item);
    }
  };

  const handleUpdate = () => {
    if (editingId && newEntry.name && newEntry.email) {
      saveData(
        data.map((item) =>
          item.id === editingId
            ? { ...item, ...newEntry }
            : item
        )
      );
      setEditingId(null);
      setNewEntry({});
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold text-gray-800">
              Employee Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={logout}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                Employee List
              </h2>
              {user?.isAdmin && (
                <button
                  onClick={handleAdd}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Employee
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  {user?.isAdmin && (
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isAdding && (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        placeholder="Name"
                        className="border rounded px-2 py-1 w-full"
                        value={newEntry.name || ''}
                        onChange={(e) =>
                          setNewEntry({ ...newEntry, name: e.target.value })
                        }
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="email"
                        placeholder="Email"
                        className="border rounded px-2 py-1 w-full"
                        value={newEntry.email || ''}
                        onChange={(e) =>
                          setNewEntry({ ...newEntry, email: e.target.value })
                        }
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        placeholder="Role"
                        className="border rounded px-2 py-1 w-full"
                        value={newEntry.role || ''}
                        onChange={(e) =>
                          setNewEntry({ ...newEntry, role: e.target.value })
                        }
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="text"
                        placeholder="Department"
                        className="border rounded px-2 py-1 w-full"
                        value={newEntry.department || ''}
                        onChange={(e) =>
                          setNewEntry({ ...newEntry, department: e.target.value })
                        }
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date().toISOString().split('T')[0]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={handleAdd}
                        className="text-green-600 hover:text-green-900 mr-3"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setIsAdding(false)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )}
                {data.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === item.id ? (
                        <input
                          type="text"
                          className="border rounded px-2 py-1 w-full"
                          value={newEntry.name || ''}
                          onChange={(e) =>
                            setNewEntry({ ...newEntry, name: e.target.value })
                          }
                        />
                      ) : (
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === item.id ? (
                        <input
                          type="email"
                          className="border rounded px-2 py-1 w-full"
                          value={newEntry.email || ''}
                          onChange={(e) =>
                            setNewEntry({ ...newEntry, email: e.target.value })
                          }
                        />
                      ) : (
                        <div className="text-sm text-gray-500">{item.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === item.id ? (
                        <input
                          type="text"
                          className="border rounded px-2 py-1 w-full"
                          value={newEntry.role || ''}
                          onChange={(e) =>
                            setNewEntry({ ...newEntry, role: e.target.value })
                          }
                        />
                      ) : (
                        <div className="text-sm text-gray-500">{item.role}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === item.id ? (
                        <input
                          type="text"
                          className="border rounded px-2 py-1 w-full"
                          value={newEntry.department || ''}
                          onChange={(e) =>
                            setNewEntry({
                              ...newEntry,
                              department: e.target.value,
                            })
                          }
                        />
                      ) : (
                        <div className="text-sm text-gray-500">
                          {item.department}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.joinDate}
                    </td>
                    {user?.isAdmin && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {editingId === item.id ? (
                          <>
                            <button
                              onClick={handleUpdate}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEdit(item.id)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}