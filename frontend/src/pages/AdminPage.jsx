import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, Users, Shield } from "lucide-react";
import axios from "axios";
import { API } from "@/App";
import { toast } from "sonner";
import { useEffect } from "react";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "user",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API}/users`);
      setUsers(response.data);
    } catch (error) {
      toast.error("Gagal memuat data user");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API}/auth/register`, formData);
      toast.success("User berhasil dibuat");
      fetchUsers();
      setDialogOpen(false);
      setFormData({ username: "", password: "", role: "user" });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Gagal membuat user");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="admin-page">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600 mt-2">Kelola user aplikasi</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
              data-testid="create-user-button"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Buat User Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Buat User Baru</DialogTitle>
              <DialogDescription>
                Tambahkan user baru ke dalam sistem
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  data-testid="create-username-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  data-testid="create-password-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger data-testid="create-role-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="superadmin">Superadmin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    setFormData({ username: "", password: "", role: "user" });
                  }}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  data-testid="submit-user-button"
                >
                  Buat User
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users List */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <CardTitle className="text-xl font-bold text-indigo-900 flex items-center gap-2">
            <Users className="h-6 w-6" />
            Daftar User ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                data-testid="user-item"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center ${
                      user.role === "superadmin"
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                        : "bg-gradient-to-br from-blue-400 to-cyan-500"
                    }`}
                  >
                    {user.role === "superadmin" ? (
                      <Shield className="h-6 w-6 text-white" />
                    ) : (
                      <Users className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{user.username}</div>
                    <div className="text-sm text-gray-500 capitalize">{user.role}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Dibuat: {new Date(user.created_at).toLocaleDateString("id-ID")}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}