<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UploadDatasetRequest;
use App\Jobs\ProcessDatasetImport;
use App\Models\Dataset;
use Illuminate\Http\JsonResponse;
use Throwable;

class DatasetController extends Controller
{
    public function store(
        UploadDatasetRequest $request
    ): JsonResponse {
        try {
            $file = $request->file('file');

            $filePath = $file->store('datasets');

            $dataset = Dataset::create([
                'name' => pathinfo(
                    $file->getClientOriginalName(),
                    PATHINFO_FILENAME
                ),
                'original_filename' => $file->getClientOriginalName(),
                'stored_filename' => $filePath,
                'total_rows' => 0,
                'status' => 'pending',
                'error_message' => null,
            ]);

            ProcessDatasetImport::dispatch($dataset->id);

            return response()->json([
                'message' => 'Dataset berhasil diupload dan sedang diproses.',
                'data' => $dataset,
            ], 202);
        } catch (Throwable $exception) {
            return response()->json([
                'message' => 'Dataset gagal diupload.',
                'error' => $exception->getMessage(),
            ], 500);
        }
    }
}
