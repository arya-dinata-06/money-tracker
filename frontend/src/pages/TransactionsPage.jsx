import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, Pencil, Trash2, Search, Filter } from "lucide-react";
import axios from "axios";
import { API } from "@/App";
import { toast } from "sonner";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [formData, setFormData] = useState({
    type: "expense",
    category_id: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transRes, catRes] = await Promise.all([
        axios.get(`${API}/transactions`),
        axios.get(`${API}/categories`),
      ]);
      setTransactions(transRes.data);
      setCategories(catRes.data);
    } catch (error) {
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingTransaction) {
        await axios.put(`${API}/transactions/${editingTransaction.id}`, formData);
        toast.success("Transaksi berhasil diperbarui");
      } else {
        await axios.post(`${API}/transactions`, formData);
        toast.success("Transaksi berhasil ditambahkan");
      }
      fetchData();
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Gagal menyimpan transaksi");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus transaksi ini?")) return;

    try {
      await axios.delete(`${API}/transactions/${id}`);
      toast.success("Transaksi berhasil dihapus");
      fetchData();
    } catch (error) {
      toast.error("Gagal menghapus transaksi");
    }
  };

  const openEditDialog = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type: transaction.type,
      category_id: transaction.category_id,
      amount: transaction.amount.toString(),
      description: transaction.description || "",
      date: transaction.date,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingTransaction(null);
    setFormData({
      type: "expense",
      category_id: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const filteredTransactions = transactions.filter((trans) => {
    const matchesSearch =
      trans.category_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trans.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || trans.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const availableCategories = categories.filter((cat) => cat.type === formData.type);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="transactions-page">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Transaksi</h1>
          <p className="text-gray-600 mt-2">Kelola semua transaksi Anda</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={resetForm}
              className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg"
              data-testid="add-transaction-button"
            >
              <Plus className="h-5 w-5 mr-2" />
              Tambah Transaksi
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingTransaction ? "Edit Transaksi" : "Tambah Transaksi Baru"}
              </DialogTitle>
              <DialogDescription>
                {editingTransaction
                  ? "Perbarui informasi transaksi"
                  : "Tambahkan transaksi pemasukan atau pengeluaran"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipe</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => {
                    setFormData({ ...formData, type: value, category_id: "" });
                  }}
                >
                  <SelectTrigger data-testid="transaction-type-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Pemasukan</SelectItem>
                    <SelectItem value="expense">Pengeluaran</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category_id">Kategori</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger data-testid="transaction-category-select">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Jumlah (IDR)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  min="0"
                  step="any"
                  data-testid="transaction-amount-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Tanggal</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  data-testid="transaction-date-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi (Opsional)</Label>
                <Textarea
                  id="description"
                  placeholder="Catatan tambahan..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  data-testid="transaction-description-input"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    resetForm();
                  }}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  data-testid="submit-transaction-button"
                >
                  {editingTransaction ? "Perbarui" : "Simpan"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Cari transaksi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="search-transactions-input"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[180px]" data-testid="filter-type-select">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                <SelectItem value="income">Pemasukan</SelectItem>
                <SelectItem value="expense">Pengeluaran</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            {filteredTransactions.length} Transaksi
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchTerm || filterType !== "all"
                ? "Tidak ada transaksi yang cocok"
                : "Belum ada transaksi. Tambahkan transaksi pertama Anda!"}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((trans) => (
                <div
                  key={trans.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  data-testid="transaction-item"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          trans.type === "income"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {trans.type === "income" ? "Pemasukan" : "Pengeluaran"}
                      </span>
                      <span className="font-medium text-gray-900">{trans.category_name}</span>
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {new Date(trans.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    {trans.description && (
                      <div className="text-sm text-gray-600 mt-1 truncate">
                        {trans.description}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <div
                      className={`text-lg font-bold whitespace-nowrap ${
                        trans.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {trans.type === "income" ? "+" : "-"}{formatCurrency(trans.amount)}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(trans)}
                        className="hover:bg-blue-50 hover:text-blue-600"
                        data-testid="edit-transaction-button"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(trans.id)}
                        className="hover:bg-red-50 hover:text-red-600"
                        data-testid="delete-transaction-button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}