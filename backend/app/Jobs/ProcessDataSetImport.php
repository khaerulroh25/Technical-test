<?php

namespace App\Jobs;

use App\Imports\TransactionsImport;
use App\Models\Dataset;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;
use Throwable;

class ProcessDatasetImport implements ShouldQueue
{
    use Queueable;
    public int $timeout = 3600;
    public int $tries = 1;

    public function __construct(
        public int $datasetId
    ) {
    }

    public function handle(): void
    {
        $dataset = Dataset::findOrFail($this->datasetId);

        $dataset->update([
            'status' => 'processing',
            'error_message' => null,
        ]);

        try {
            $filePath = Storage::path(
                $dataset->stored_filename
            );

            Excel::import(
                new TransactionsImport($dataset->id),
                $filePath
            );

            $totalRows = $dataset
                ->transactions()
                ->count();

            $dataset->update([
                'total_rows' => $totalRows,
                'status' => 'completed',
                'error_message' => null,
            ]);
        } catch (Throwable $exception) {
            $dataset->update([
                'status' => 'failed',
                'error_message' => $exception->getMessage(),
            ]);

            Log::error('Dataset import failed', [
                'dataset_id' => $dataset->id,
                'error' => $exception->getMessage(),
            ]);

            throw $exception;
        }
    }
}
