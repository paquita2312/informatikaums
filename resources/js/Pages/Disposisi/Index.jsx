import { useEffect, useState } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function Index() {
  const [jenisSurat, setJenisSurat] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
  if (!jenisSurat) return; // hanya cek jenisSurat

  const fetchData = async () => {
    try {
      const response = await axios.get(route("disposisi.search"), {
        params: {
          jenis: jenisSurat,
          tanggal: tanggal, // boleh kosong
        },
      });
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  fetchData();
}, [jenisSurat, tanggal]);

  return (
    <AuthenticatedLayout header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Data Disposisi</h2>}>
      <div className="p-6 bg-white rounded shadow">
        <div className="flex items-center gap-4 mb-4 justify-around">
            <div className="flex flex-col w-80">
                <label className="mb-2 font-bold"> Tanggal </label>
                <input
                type="date"
                className="border px-2 py-1"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                />
            </div>
            <div  className="flex flex-col w-96">
                <label className="mb-2 font-bold"> Kategori Surat </label>
                <select
                    className="border px-2 py-1"
                    value={jenisSurat}
                    onChange={(e) => setJenisSurat(e.target.value)}
                >
                    <option value="">Pilih Kategori Surat</option>
                    <option value="masuk">Surat Masuk</option>
                    <option value="keluar">Surat Keluar</option>
                </select>
            </div>
        </div>

        {results.length > 0 && (
          <table className="table-auto w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">No</th>
                <th className="border px-2 py-1">Tanggal Terima Surat</th>
                <th className="border px-2 py-1">Tanggal Surat</th>
                <th className="border px-2 py-1">No Surat</th>
                <th className="border px-2 py-1">Disposisi</th>
                <th className="border px-2 py-1">Catatan Disposisi</th>
                <th className="border px-2 py-1">Tindakan</th>
                <th className="border px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
                {results.map((item, index) => (
                    <tr key={index}>
                    <td className="border px-2 py-1">{index + 1}</td>
                    <td className="border px-2 py-1">{item.tanggal_terima_surat}</td>
                    <td className="border px-2 py-1">
                        {jenisSurat === "masuk" ? item.tanggal_surat_masuk : item.tanggal_surat_keluar}
                    </td>
                    <td className="border px-2 py-1">
                        {jenisSurat === "masuk" ? item.nomor_surat_masuk : item.nomor_surat_keluar}
                    </td>
                    <td className="border px-2 py-1">{item.pengirim?.name || '-'}</td>
                    <td className="border px-2 py-1">{item.catatan_disposisi}</td>
                    <td className="border px-2 py-1">{item.tindakan}</td>
                    <td className="border px-2 py-1">
                        <button className="bg-blue-500 text-white px-2 py-1 text-sm rounded">Lihat</button>
                    </td>
                    </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
