import React, { useState, useEffect } from 'react';
import { Search, UserMinus, UserCheck, Shield, Mail, Calendar, Eye } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Loader } from '@/components/common/Loader';
import { Badge } from '@/components/common/Badge';
import { adminService } from '@/services/adminService';
import type { User } from '@/types';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getUsers({ search, page, limit: 10 });
      setUsers(response.data);
      if (response.pagination) {
        setTotalPages(response.pagination.pages);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const updated = await adminService.toggleUserStatus(id);
      setUsers(prev => prev.map(u => (u._id === id ? updated : u)));
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-800 flex items-center gap-2">
          Users Management
        </h1>
        <p className="text-gray-500">
          Search, audit, enable, or disable users across the platform.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-rose-100/60 focus:outline-none focus:ring-2 focus:ring-rose-300/50"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Date Joined</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100/60 text-sm">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-rose-50/20 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span>{user.role}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.isActive ? (
                        <span className="badge-sage">Active</span>
                      ) : (
                        <span className="badge bg-red-100 text-red-700">Disabled</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant={user.isActive ? 'danger' : 'primary'}
                        size="sm"
                        onClick={() => handleToggleStatus(user._id)}
                        className="py-1 px-3 text-xs"
                      >
                        {user.isActive ? (
                          <>
                            <UserMinus className="w-3.5 h-3.5" /> Disable
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5" /> Enable
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 bg-gray-50/50 border-t border-gray-100/60">
              <span className="text-xs text-gray-400">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Prev
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};
export default UserManagement;
