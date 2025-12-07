import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet, Activity } from "lucide-react";
import axios from "axios";
import { API } from "@/App";
import { toast } from "sonner";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, transRes] = await Promise.all([
        axios.get(`${API}/transactions/stats`),
        axios.get(`${API}/transactions`),
      ]);
      setStats(statsRes.data);
      setTransactions(transRes.data.slice(0, 5)); // Latest 5 transactions
    } catch (error) {
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8" data-testid="dashboard-page">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Ringkasan keuangan Anda</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Total Pemasukan</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900" data-testid="total-income">
              {formatCurrency(stats?.total_income || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-red-50 to-rose-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Total Pengeluaran</CardTitle>
            <TrendingDown className="h-5 w-5 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900" data-testid="total-expense">
              {formatCurrency(stats?.total_expense || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Saldo</CardTitle>
            <Wallet className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              (stats?.balance || 0) >= 0 ? "text-blue-900" : "text-red-900"
            }`} data-testid="balance">
              {formatCurrency(stats?.balance || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Total Transaksi</CardTitle>
            <Activity className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900" data-testid="transaction-count">
              {stats?.transaction_count || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Transaksi Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Belum ada transaksi</div>
          ) : (
            <div className="space-y-3">
              {transactions.map((trans) => (
                <div
                  key={trans.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  data-testid="recent-transaction-item"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{trans.category_name}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(trans.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    {trans.description && (
                      <div className="text-sm text-gray-600 mt-1">{trans.description}</div>
                    )}
                  </div>
                  <div className={`text-lg font-bold ${
                    trans.type === "income" ? "text-green-600" : "text-red-600"
                  }`}>
                    {trans.type === "income" ? "+" : "-"}{formatCurrency(trans.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      {stats?.category_breakdown && Object.keys(stats.category_breakdown).length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Breakdown per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.category_breakdown).map(([category, amounts]) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{category}</span>
                    <div className="flex gap-4 text-sm">
                      {amounts.income > 0 && (
                        <span className="text-green-600 font-medium">
                          +{formatCurrency(amounts.income)}
                        </span>
                      )}
                      {amounts.expense > 0 && (
                        <span className="text-red-600 font-medium">
                          -{formatCurrency(amounts.expense)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}