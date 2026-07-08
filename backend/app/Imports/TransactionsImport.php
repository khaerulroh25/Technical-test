<?php

namespace App\Imports;

use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithBatchInserts;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class TransactionsImport implements
    ToModel,
    WithHeadingRow,
    WithChunkReading,
    WithBatchInserts,
    SkipsEmptyRows
{
    public function __construct(
        private readonly int $datasetId
    ) {
    }

    public function model(array $row): ?Transaction
    {
        $invoiceNo = trim((string) ($row['invoiceno'] ?? ''));
        $stockCode = trim((string) ($row['stockcode'] ?? ''));
        $description = $this->nullableString(
            $row['description'] ?? null
        );
        $quantity = (int) ($row['quantity'] ?? 0);
        $unitPrice = (float) ($row['unitprice'] ?? 0);
        $customerId = $this->nullableString(
            $row['customerid'] ?? null
        );
        $country = trim((string) ($row['country'] ?? ''));
        $invoiceDate = $this->parseDate(
            $row['invoicedate'] ?? null
        );

        // Skip row jika data wajib tidak valid
        if (
            $invoiceNo === '' ||
            $stockCode === '' ||
            $country === '' ||
            $invoiceDate === null
        ) {
            return null;
        }

        // Skip transaksi cancellation
        if (str_starts_with(strtoupper($invoiceNo), 'C')) {
            return null;
        }

        // Skip quantity atau harga yang tidak valid
        if ($quantity <= 0 || $unitPrice <= 0) {
            return null;
        }

        return new Transaction([
            'dataset_id' => $this->datasetId,
            'invoice_no' => $invoiceNo,
            'stock_code' => $stockCode,
            'description' => $description,
            'quantity' => $quantity,
            'invoice_date' => $invoiceDate,
            'unit_price' => $unitPrice,
            'customer_id' => $customerId,
            'country' => $country,
            'total_sales' => $quantity * $unitPrice,
        ]);
    }

    private function nullableString(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }

    private function parseDate(mixed $value): ?Carbon
    {
        if ($value === null || $value === '') {
            return null;
        }

        try {
            // Format tanggal dari file XLSX
            if (is_numeric($value)) {
                return Carbon::instance(
                    Date::excelToDateTimeObject($value)
                );
            }

            // Format tanggal string dari CSV
            return Carbon::parse($value);
        } catch (\Throwable) {
            return null;
        }
    }

    public function chunkSize(): int
    {
        return 1000;
    }

    public function batchSize(): int
    {
        return 1000;
    }
}
