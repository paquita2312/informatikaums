<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SuratTugasController;

Route::post('/surat-tugas', [SuratTugasController::class, 'store']);
