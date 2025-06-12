<?php

namespace App\Enums;

enum UserRole: string
{
    case Prodi = 'admin_prodi';
    case Fakultas = 'admin_fakultas';
    case Pimpinan = 'pimpinan';
    case Karyawan = 'karyawan';
}
