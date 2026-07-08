<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dataset;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function overview(Dataset $dataset): JsonResponse
    {
        if ($dataset->status !== 'completed') {
            return response()->json([
                'message' => 'Dataset belum selesai diproses.',
            ], 409);
        }

        $overview = $dataset
            ->transactions()
            ->selectRaw('
                COALESCE(SUM(total_sales), 0) as total_revenue,
                COUNT(DISTINCT invoice_no) as total_orders,
                COALESCE(SUM(quantity), 0) as products_sold,
                COUNT(DISTINCT customer_id) as total_customers
            ')
            ->first();

        return response()->json([
            'message' => 'Dashboard overview berhasil diambil.',
            'data' => [
                'total_revenue' => (float) $overview->total_revenue,
                'total_orders' => (int) $overview->total_orders,
                'products_sold' => (int) $overview->products_sold,
                'total_customers' => (int) $overview->total_customers,
            ],
        ]);
    }
}
