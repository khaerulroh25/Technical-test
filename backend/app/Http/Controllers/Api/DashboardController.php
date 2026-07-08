<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dataset;
use Illuminate\Http\JsonResponse;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Http\Requests\DashboardFilterRequest;

class DashboardController extends Controller
{
    public function overview(DashboardFilterRequest $request, Dataset $dataset): JsonResponse
    {
        if ($dataset->status !== 'completed') {
            return response()->json([
                'message' => 'Dataset belum selesai diproses.',
            ], 409);
        }

        $filters = $request->validated();

        $query = $this->applyFilters(
            $dataset->transactions(),
            $filters
        );

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
            'filters' => $this->formatFilters($filters),
            'data' => [
                'total_revenue' => (float) $overview->total_revenue,
                'total_orders' => (int) $overview->total_orders,
                'products_sold' => (int) $overview->products_sold,
                'total_customers' => (int) $overview->total_customers,
            ],
        ]);
    }

    public function salesTrend(
        DashboardFilterRequest $request,
        Dataset $dataset
    ): JsonResponse {
        if ($dataset->status !== 'completed') {
            return response()->json([
                'message' => 'Dataset belum selesai diproses.',
            ], 409);
        }

        $filters = $request->validated();

        $query = $this->applyFilters(
            $dataset->transactions(),
            $filters
        );

        $salesTrend = $query
            ->selectRaw('
            DATE_FORMAT(invoice_date, "%Y-%m") as period,
            COALESCE(SUM(total_sales), 0) as revenue
        ')
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->map(function ($item) {
                return [
                    'period' => $item->period,
                    'revenue' => (float) $item->revenue,
                ];
            });

        return response()->json([
            'message' => 'Sales trend berhasil diambil.',
            'filters' => $this->formatFilters($filters),
            'data' => $salesTrend,
        ]);
    }

    public function salesByCountry(
        DashboardFilterRequest $request,
        Dataset $dataset
    ): JsonResponse {
        if ($dataset->status !== 'completed') {
            return response()->json([
                'message' => 'Dataset belum selesai diproses.',
            ], 409);
        }

        $filters = $request->validated();

        $query = $this->applyFilters(
            $dataset->transactions(),
            $filters
        );

        $salesByCountry = $query
            ->selectRaw('
            country,
            COALESCE(SUM(total_sales), 0) as revenue
        ')
            ->groupBy('country')
            ->orderByDesc('revenue')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'country' => $item->country,
                    'revenue' => (float) $item->revenue,
                ];
            });

        return response()->json([
            'message' => 'Sales by country berhasil diambil.',
            'filters' => $this->formatFilters($filters),
            'data' => $salesByCountry,
        ]);
    }

    public function topProducts(
        DashboardFilterRequest $request,
        Dataset $dataset
    ): JsonResponse {
        if ($dataset->status !== 'completed') {
            return response()->json([
                'message' => 'Dataset belum selesai diproses.',
            ], 409);
        }

        $filters = $request->validated();

        $query = $this->applyFilters(
            $dataset->transactions(),
            $filters
        );

        $topProducts = $query
            ->selectRaw('
            stock_code,
            description,
            COALESCE(SUM(quantity), 0) as quantity
        ')
            ->groupBy('stock_code', 'description')
            ->orderByDesc('quantity')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'stock_code' => $item->stock_code,
                    'product' => $item->description
                        ?? $item->stock_code,
                    'quantity' => (int) $item->quantity,
                ];
            });

        return response()->json([
            'message' => 'Top products berhasil diambil.',
            'filters' => $this->formatFilters($filters),
            'data' => $topProducts,
        ]);
    }

    public function filterOptions(
        Dataset $dataset
    ): JsonResponse {
        if ($dataset->status !== 'completed') {
            return response()->json([
                'message' => 'Dataset belum selesai diproses.',
            ], 409);
        }

        $countries = $dataset
            ->transactions()
            ->whereNotNull('country')
            ->where('country', '!=', '')
            ->distinct()
            ->orderBy('country')
            ->pluck('country');

        return response()->json([
            'message' => 'Filter options berhasil diambil.',
            'data' => [
                'countries' => $countries,
            ],
        ]);
    }

    private function applyFilters(HasMany $query, array $filters): HasMany
    {
        if (!empty($filters['date_from'])) {
            $query->whereDate(
                'invoice_date',
                '>=',
                $filters['date_from']
            );
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate(
                'invoice_date',
                '<=',
                $filters['date_to']
            );
        }

        if (!empty($filters['country'])) {
            $query->where(
                'country',
                $filters['country']
            );
        }

        return $query;
    }

    private function formatFilters(array $filters): array
    {
        return [
            'date_from' => $filters['date_from'] ?? null,
            'date_to' => $filters['date_to'] ?? null,
            'country' => $filters['country'] ?? null,
        ];
    }
}
