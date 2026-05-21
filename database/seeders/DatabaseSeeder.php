<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Book;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Bikin Admin & Member
        $admin = User::create([
            'name' => 'Admin Malaka',
            'email' => 'admin@mail.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '081234567890',
            'address' => 'Kantor Perpustakaan Malaka, Lantai 2',
        ]);

        $member1 = User::create([
            'name' => 'Hilman Member',
            'email' => 'hilman@mail.com',
            'password' => Hash::make('password'),
            'role' => 'member',
            'phone' => '081298765432',
            'address' => 'Jl. Merdeka No. 10, Jakarta Selatan',
        ]);

        $member2 = User::create([
            'name' => 'Pak Hermansyah',
            'email' => 'hermansyah@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'member',
            'phone' => '085612345678',
            'address' => 'Jl. Sudirman No. 45, Bandung',
        ]);

        // Petugas Perpustakaan
        User::create([
            'name' => 'Petugas Malaka',
            'email' => 'petugas@mail.com',
            'password' => Hash::make('password'),
            'role' => 'petugas',
            'phone' => '081300001111',
            'address' => 'Kantor Perpustakaan Malaka',
        ]);

        // 2. Bikin Kategori
        $sains = Category::create(['name' => 'Sains', 'slug' => 'sains']);
        $filsafat = Category::create(['name' => 'Filsafat', 'slug' => 'filsafat']);
        $teknologi = Category::create(['name' => 'Teknologi', 'slug' => 'teknologi']);
        $sastra = Category::create(['name' => 'Sastra', 'slug' => 'sastra']);

        // 3. Bikin Buku (year harus 1901-2155 untuk MySQL YEAR type)
        $buku1 = Book::create([
            'added_by' => $admin->id,
            'title' => 'Beyond Good and Evil',
            'author' => 'Friedrich Nietzsche',
            'publisher' => 'Penguin Books',
            'isbn' => '9780140449235',
            'year' => 2003, // Edisi reprint modern
            'stock' => 5,
            'available' => 5,
            'description' => 'A fundamental text of Nietzschean philosophy exploring morality and the nature of truth.',
            'is_approved' => true,
        ]);
        $buku1->categories()->attach($filsafat->id);

        $buku2 = Book::create([
            'added_by' => $admin->id,
            'title' => 'The Order of Time',
            'author' => 'Carlo Rovelli',
            'publisher' => 'Riverhead Books',
            'isbn' => '9780735211292',
            'year' => 2017,
            'stock' => 3,
            'available' => 3,
            'description' => 'A deep dive into physics and the nature of time by a theoretical physicist.',
            'is_approved' => true,
        ]);
        $buku2->categories()->attach([$sains->id, $filsafat->id]);

        $buku3 = Book::create([
            'added_by' => $admin->id,
            'title' => 'Clean Code',
            'author' => 'Robert C. Martin',
            'publisher' => 'Pearson',
            'isbn' => '9780132350884',
            'year' => 2008,
            'stock' => 4,
            'available' => 4,
            'description' => 'A handbook of agile software craftsmanship for writing better code.',
            'is_approved' => true,
        ]);
        $buku3->categories()->attach($teknologi->id);

        $buku4 = Book::create([
            'added_by' => $admin->id,
            'title' => 'Laskar Pelangi',
            'author' => 'Andrea Hirata',
            'publisher' => 'Bentang Pustaka',
            'isbn' => '9789793062792',
            'year' => 2005,
            'stock' => 6,
            'available' => 6,
            'description' => 'Novel inspiratif tentang perjuangan anak-anak Belitung mengejar mimpi melalui pendidikan.',
            'is_approved' => true,
        ]);
        $buku4->categories()->attach($sastra->id);

        $buku5 = Book::create([
            'added_by' => $admin->id,
            'title' => 'Sapiens: A Brief History of Humankind',
            'author' => 'Yuval Noah Harari',
            'publisher' => 'Harper',
            'isbn' => '9780062316110',
            'year' => 2014,
            'stock' => 2,
            'available' => 2,
            'description' => 'Perjalanan manusia dari zaman batu hingga era digital yang mengubah pandangan kita tentang sejarah.',
            'is_approved' => true,
        ]);
        $buku5->categories()->attach([$sains->id, $filsafat->id]);
    }
}