<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'dataset_id',
        'invoice_no',
        'stock_code',
        'description',
        'quantity',
        'invoice_date',
        'unit_price',
        'customer_id',
        'country',
        'total_sales',
    ];

    protected function casts(): array
    {
        return [
            'invoice_date' => 'datetime',
            'quantity' => 'integer',
            'unit_price' => 'decimal:2',
            'total_sales' => 'decimal:2',
        ];
    }

    public function dataset(): BelongsTo
    {
        return $this->belongsTo(Dataset::class);
    }
}
