import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileCode, CheckCircle, AlertCircle } from "lucide-react";
import axios from "axios";
import { API } from "@/App";
import { toast } from "sonner";
import { useState } from "react";

export default function DownloadPage() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await axios.get(`${API}/download/source-code`, {
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "money-tracker-source-code.zip");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Source code berhasil didownload!");
    } catch (error) {
      toast.error("Gagal mendownload source code");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8" data-testid="download-page">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Download Source Code</h1>
        <p className="text-gray-600 mt-2">Download semua file aplikasi MoneyTracker</p>
      </div>

      {/* Download Card */}
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-indigo-50 to-purple-100">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-xl">
              <FileCode className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            MoneyTracker Source Code
          </CardTitle>
          <CardDescription className="text-base mt-2">
            Download file ZIP berisi semua source code aplikasi beserta dokumentasi lengkap
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-white rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">Yang Termasuk:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900">Backend (FastAPI)</div>
                  <div className="text-sm text-gray-600">Python server dengan MongoDB</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900">Frontend (React)</div>
                  <div className="text-sm text-gray-600">React app dengan Tailwind CSS</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900">README.md</div>
                  <div className="text-sm text-gray-600">Panduan lengkap setup & deploy</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900">MySQL Guide</div>
                  <div className="text-sm text-gray-600">Dokumentasi alternatif MySQL</div>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full h-14 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold text-lg shadow-xl"
            data-testid="download-source-code-button"
          >
            <Download className="h-6 w-6 mr-3" />
            {downloading ? "Mendownload..." : "Download Source Code (ZIP)"}
          </Button>
        </CardContent>
      </Card>

      {/* Setup Instructions Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-indigo-600" />
            Cara Menjalankan Aplikasi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-2">1. Extract File ZIP</h4>
              <p className="text-sm text-blue-800">
                Setelah download selesai, extract file ZIP ke folder pilihan Anda
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2">2. Baca README.md</h4>
              <p className="text-sm text-green-800">
                Buka file README.md untuk panduan setup lengkap (MongoDB & MySQL)
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 mb-2">3. Install Dependencies</h4>
              <p className="text-sm text-purple-800">
                Install semua dependencies untuk backend (Python) dan frontend (Node.js)
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-900 mb-2">4. Jalankan Aplikasi</h4>
              <p className="text-sm text-orange-800">
                Start backend server dan frontend development server
              </p>
            </div>
          </div>

          <div className="mt-6 p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-300">
            <h4 className="font-semibold text-gray-900 mb-3">Dukungan Platform:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">Windows 10/11</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">Linux (Ubuntu, etc)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">macOS</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-gray-700">Docker (Recommended)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}