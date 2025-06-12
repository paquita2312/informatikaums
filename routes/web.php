<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\KategoriController;
use App\Http\Controllers\SuratMasukController;
use App\Http\Controllers\PeriksaSuratMasukController;
use App\Http\Controllers\DisposisiController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\SuratKeluarController;
use App\Http\Controllers\SuratTugasController;
use App\Http\Controllers\SuratKPController;
use App\Http\Controllers\SKDekanController;
use App\Http\Controllers\SuratDanaRakerController;
use App\Http\Controllers\PeriksaSuratKeluarController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/user', [UserController::class, 'index'])->name('user.index');
    Route::get('/user/create', [UserController::class, 'create'])->name('user.create');
    Route::post('/user', [UserController::class, 'store'])->name('user.store');

    Route::put('/user/{user}', [UserController::class, 'update'])->name('user.update');  // update user
    Route::delete('/user/{user}', [UserController::class, 'destroy'])->name('user.destroy');  // delete user
});


Route::middleware('auth')->group(function () {
    Route::get('/kategori-surat', [KategoriController::class, 'index'])->name('kategori.index');
    Route::post('/kategori-surat', [KategoriController::class, 'store'])->name('kategori.store');
    Route::put('/kategori-surat/{id}', [KategoriController::class, 'update'])->name('kategori.update');
    Route::delete('/kategori-surat/{id}', [KategoriController::class, 'destroy'])->name('kategori.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/surat-masuk', [SuratMasukController::class, 'index'])->name('suratmasuk.index');
    Route::post('/surat-masuk', [SuratMasukController::class, 'store'])->name('suratmasuk.store');
    Route::put('/surat-masuk/{id}', [SuratMasukController::class, 'update'])->name('suratmasuk.update');
    Route::post('/surat-masuk/{id}', [SuratMasukController::class, 'update'])->name('suratmasuk.update');
    Route::delete('/surat-masuk/{id}', [SuratMasukController::class, 'destroy'])->name('suratmasuk.destroy');
    Route::get('/surat-masuk/{id}', [SuratMasukController::class, 'show'])->name('suratmasuk.show');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/periksa-surat-masuk', [PeriksaSuratMasukController::class, 'index'])->name('periksa-surat.index');
    Route::post('/periksa-surat-masuk', [PeriksaSuratMasukController::class, 'store'])->name('periksa-surat.store');
    Route::post('/periksa-surat-masuk/terima', [PeriksaSuratMasukController::class, 'terima'])->name('periksa.terima');
    Route::post('/periksa-surat-masuk/disposisi', [PeriksaSuratMasukController::class, 'disposisi'])->name('periksa.disposisi');

});

Route::prefix('periksa-surat-keluar')->middleware('auth')->group(function () {
    Route::get('/', [PeriksaSuratKeluarController::class, 'index'])->name('periksa-surat-keluar.index');
    Route::post('/', [PeriksaSuratKeluarController::class, 'store'])->name('periksa-surat-keluar.store');
    Route::post('/terima', [PeriksaSuratKeluarController::class, 'terima'])->name('periksa-surat-keluar.terima');
    Route::post('/disposisi', [PeriksaSuratKeluarController::class, 'disposisi'])->name('periksa.disposisi');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/surat-keluar', [SuratKeluarController::class, 'index'])->name('surat-keluar.index');
    Route::post('/surat-keluar', [SuratKeluarController::class, 'store'])->name('surat-keluar.store');
    Route::put   ('/surat-keluar/{suratKeluar}', [SuratKeluarController::class, 'update'])->name('surat-keluar.update');
    Route::delete('/surat-keluar/{suratKeluar}', [SuratKeluarController::class, 'destroy'])->name('surat-keluar.destroy');
    Route::get('/surat-keluar/{id}', [SuratKeluarController::class, 'show'])->name('surat-keluar.show');
});

Route::get('/surat-tugas/create', [SuratTugasController::class, 'create']);
Route::post('/surat-tugas', [SuratTugasController::class, 'store'])->name('surat-tugas.store');
Route::get('/surat-tugas/berkas/{filename}', function ($filename) {
    $path = storage_path('app/surat_tugas/' . $filename);

    if (!File::exists($path)) {
        abort(404);
    }

    return Response::make(File::get($path), 200, [
        'Content-Type' => File::mimeType($path),
        'Content-Disposition' => 'inline; filename="'.$filename.'"'
    ]);
});

Route::get('/surat-kp/create', [SuratKPController::class, 'create']);
Route::post('/surat-kp', [SuratKPController::class, 'store'])->name('surat-kp.store');
Route::get('/surat-kp/berkas/{filename}', function ($filename) {
    $path = storage_path('app/surat_kp/' . $filename);

    if (!File::exists($path)) {
        abort(404);
    }

    return Response::make(File::get($path), 200, [
        'Content-Type' => File::mimeType($path),
        'Content-Disposition' => 'inline; filename="'.$filename.'"'
    ]);
});

Route::post('/sk-dekan', [SKDekanController::class, 'store'])->name('sk-dekan.store');

Route::post('/surat-danaraker', [SuratDanaRakerController::class, 'store'])->name('surat-danaraker.store');

Route::get('/disposisi', [DisposisiController::class, 'index'])->name('disposisi.index');
Route::get('/disposisi/search', [DisposisiController::class, 'search'])->name('disposisi.search');


require __DIR__.'/auth.php';
