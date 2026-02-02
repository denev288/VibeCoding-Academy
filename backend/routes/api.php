<?php

declare(strict_types=1);

use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\ToolController;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/status', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toIso8601String(),
    ]);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/login', function (LoginRequest $request) {
    $request->authenticate();

    $request->session()->regenerate();

    return response()->json($request->user());
});

Route::post('/logout', function (Request $request) {
    Auth::guard('web')->logout();

    $request->session()->invalidate();

    $request->session()->regenerateToken();

    return response()->noContent();
});

Route::get('/roles', [RoleController::class, 'index']);

Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store'])->middleware('auth:sanctum');

Route::get('/tags', [TagController::class, 'index']);
Route::post('/tags', [TagController::class, 'store'])->middleware('auth:sanctum');

Route::get('/tools', [ToolController::class, 'index'])->middleware('auth:sanctum');
Route::get('/tools/{tool}', [ToolController::class, 'show'])->middleware('auth:sanctum');
Route::post('/tools', [ToolController::class, 'store'])->middleware('auth:sanctum');
Route::put('/tools/{tool}', [ToolController::class, 'update'])->middleware('auth:sanctum');
Route::delete('/tools/{tool}', [ToolController::class, 'destroy'])->middleware('auth:sanctum');
