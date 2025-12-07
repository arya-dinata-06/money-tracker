import { useState, useEffect } from "react";
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
import { Plus, Tag } from "lucide-react";
import axios from "axios";
import { API } from "@/App";
import { toast } from "sonner";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "expense",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/categories`);
      setCategories(response.data);
    } catch (error) {
      toast.error("Gagal memuat kategori");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API}/categories`, formData);
      toast.success("Kategori berhasil ditambahkan");
      fetchCategories();
      setDialogOpen(false);
      setFormData({ name: "", type: "expense" });
    } catch (error) {
      toast.error(error.response?.data?.detail || "Gagal menambahkan kategori");
    }
  };

  const incomeCategories = categories.filter((cat) => cat.type === "income");
  const expenseCategories = categories.filter((cat) => cat.type === "expense");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="categories-page">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Kategori</h1>
          <p className="text-gray-600 mt-2">Kelola kategori transaksi Anda</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
              data-testid="add-category-button"
            >
              <Plus className="h-5 w-5 mr-2" />
              Tambah Kategori
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Tambah Kategori Baru</DialogTitle>
              <DialogDescription>
                Buat kategori custom untuk mengorganisir transaksi Anda
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Kategori</Label>
                <Input
                  id="name"
                  placeholder="Contoh: Investasi, Hiburan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  data-testid="category-name-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipe</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger data-testid="category-type-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Pemasukan</SelectItem>
                    <SelectItem value="expense">Pengeluaran</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    setFormData({ name: "", type: "expense" });
                  }}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  data-testid="submit-category-button"
                >
                  Simpan
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Income Categories */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardTitle className="text-xl font-bold text-green-900">
            Kategori Pemasukan ({incomeCategories.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {incomeCategories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg"
                data-testid="income-category-item"
              >
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Tag className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{cat.name}</div>
                  {cat.is_custom && (
                    <div className="text-xs text-green-600 mt-1">Custom</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {incomeCategories.length === 0 && (
            <div className="text-center py-8 text-gray-500">Belum ada kategori pemasukan</div>
          )}
        </CardContent>
      </Card>

      {/* Expense Categories */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50">
          <CardTitle className="text-xl font-bold text-red-900">
            Kategori Pengeluaran ({expenseCategories.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {expenseCategories.map((cat) => (
              <div
                key={cat.id}
                className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
                data-testid="expense-category-item"
              >
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Tag className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{cat.name}</div>
                  {cat.is_custom && (
                    <div className="text-xs text-red-600 mt-1">Custom</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {expenseCategories.length === 0 && (
            <div className="text-center py-8 text-gray-500">Belum ada kategori pengeluaran</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}