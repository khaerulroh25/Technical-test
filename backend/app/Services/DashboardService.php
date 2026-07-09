<?php

namespace App\Services;

use App\Models\Dataset;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DashboardService
{
    private function applyFilters(Builder|HasMany $query, array $filters): Builder|HasMany
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

    public function getOverview(Dataset $dataset, array $filters): array
    {
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

        return [
            'total_revenue' => (float) $overview->total_revenue,
            'total_orders' => (int) $overview->total_orders,
            'products_sold' => (int) $overview->products_sold,
            'total_customers' => (int) $overview->total_customers,
        ];
    }

    public function getSalesTrend(Dataset $dataset, array $filters): array
    {
        $query = $this->applyFilters(
            $dataset->transactions(),
            $filters
        );

        return $query
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
            })
            ->toArray();
    }

    public function getSalesByCountry(Dataset $dataset, array $filters): array
    {
        $query = $this->applyFilters(
            $dataset->transactions(),
            $filters
        );

        return $query
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
            })
            ->toArray();
    }

    public function getTopProducts(Dataset $dataset, array $filters): array
    {
        $query = $this->applyFilters(
            $dataset->transactions(),
            $filters
        );

        return $query
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
                    'product' => $item->description ?? $item->stock_code,
                    'quantity' => (int) $item->quantity,
                ];
            })
            ->toArray();
    }
}
