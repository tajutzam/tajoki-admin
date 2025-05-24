<?php

use App\Http\Controllers\CategoryServiceController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TestimoniController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('users', UserController::class)->except(['create', 'show', 'edit']);
    Route::resource('testimonies', TestimoniController::class)->except(['create', 'show', 'edit']);
    Route::get('category-services', [CategoryServiceController::class, 'index'])->name('category-services.index');

    Route::post('category-services', [CategoryServiceController::class, 'store'])->name('category-services.store');

    Route::post('category-services/{id}', [CategoryServiceController::class, 'update'])->name('category-services.update');

    Route::delete('category-services/{id}', [CategoryServiceController::class, 'destroy'])->name('category-services.destroy');

    Route::get('projects', [ProjectController::class, 'index'])->name('projects.index');

    Route::post('projects', [ProjectController::class, 'store'])->name('projects.store');

    Route::put('projects/{id}', [ProjectController::class, 'update'])->name('projects.update');

    Route::delete('projects/{id}', [ProjectController::class, 'destroy'])->name('projects.destroy');

});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
