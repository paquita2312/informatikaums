<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\KategoriSurat;



class KategoriController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->query('search'); // ambil query search dari URL

        $kategori = KategoriSurat::query()
            ->when($search, function ($query, $search) {
                $query->where('nama', 'like', '%' . $search . '%');
            })
            ->get();

        return inertia('Kategori/index', [
            'kategori' => $kategori,
            'search' => $search, // dikirim ke frontend agar field tetap terisi
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
        'nama' => 'required|string|max:255|unique:kategori_surats,nama',
        ]);

        KategoriSurat::create(['nama' => $request->nama]);

        return redirect()->route('kategori.index')->with('message', 'Kategori berhasil ditambahkan');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'nama' => 'required|string|max:255|unique:kategori_surats,nama,' . $id,
        ]);

        $kategori = KategoriSurat::findOrFail($id);
        $kategori->update(['nama' => $request->nama]);

        return redirect()->route('kategori.index')->with('message', 'Kategori berhasil diperbarui');
    }

    public function destroy($id)
    {
        $kategori = KategoriSurat::findOrFail($id);
        $kategori->delete();

        return redirect()->route('kategori.index')->with('message', 'Kategori berhasil dihapus');
    }
}
