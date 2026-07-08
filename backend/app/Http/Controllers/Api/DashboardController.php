<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dataset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function overview(Request $request, Dataset $dataset): JsonResponse
    {
        if ($dataset->status !== 'completed') {
            return response()->json([
                'message' => 'Dataset belum selesai diproses.',
            ], 409);
        }

        $validated = $request->validate([
            'date_from' => [
                'nullable',
                'date',
            ],
            'date_to' => [
                'nullable',
                'date',
                'after_or_equal:date_from',
            ],
            'country' => [
                'nullable',
                'string',
                'max:100',
            ],
        ]);

        $query = $dataset->transactions();

        if (!empty($validated['date_from'])) {
            $query->whereDate(
                'invoice_date',
                '>=',
                $validated['date_from']
            );
        }

        if (!empty($validated['date_to'])) {
            $query->whereDate(
                'invoice_date',
                '<=',
                $validated['date_to']
            );
        }

        if (!empty($validated['country'])) {
            $query->where(
                'country',
                $validated['country']
            );
        }

        $overview = $query
            ->selectRaw('
                COALESCE(SUM(total_sales), 0) as total_revenue,
                COUNT(DISTINCT invoice_no) as total_orders,
                COALESCE(SUM(quantity), 0) as products_sold,
                COUNT(DISTINCT customer_id) as total_customers
            ')
            ->first();

        return response()->json([
            'message' => 'Dashboard overview berhasil diambil.',
            'filters' => [
                'date_from' => $validated['date_from'] ?? null,
                'date_to' => $validated['date_to'] ?? null,
                'country' => $validated['country'] ?? null,
            ],
            'data' => [
                'total_revenue' => (float) $overview->total_revenue,
                'total_orders' => (int) $overview->total_orders,
                'products_sold' => (int) $overview->products_sold,
                'total_customers' => (int) $overview->total_customers,
            ],
        ]);
    }
}
