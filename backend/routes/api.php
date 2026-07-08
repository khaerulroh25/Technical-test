<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\DatasetController;
use App\Http\Controllers\Api\DashboardController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/datasets/upload', [DatasetController::class, 'store']);
Route::get('/datasets/{dataset}/status', [DatasetController::class, 'status']);
Route::get('/datasets/{dataset}/dashboard/overview', [DashboardController::class, 'overview']);
