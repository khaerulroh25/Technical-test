<?php

namespace App\Http\Controllers\Api;

use App\Services\DashboardService;
use App\Http\Controllers\Controller;
use App\Models\Dataset;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\DashboardFilterRequest;

class DashboardController extends Controller
{
    public function __construct(
        private DashboardService $dashboardService
    ) {
    }
    public function overview(DashboardFilterRequest $request, Dataset $dataset): JsonResponse
    {
        if ($dataset->status !== 'completed') {
            return response()->json([
                'message' => 'Dataset belum selesai diproses.',
            ], 409);
        }

        $filters = $request->validated();

        $overview = $this->dashboardService->getOverview(
            $dataset,
            $filters
        );

        return response()->json([
            'message' => 'Dashboard overview berhasil diambil.',
            'filters' => $this->formatFilters($filters),
            'data' => $overview,
        ]);
    }

    public function salesTrend(DashboardFilterRequest $request, Dataset $dataset): JsonResponse
    {
        if ($dataset->status !== 'completed') {
            return response()->json([
                'message' => 'Dataset belum selesai diproses.',
            ], 409);
        }

        $filters = $request->validated();

        $salesTrend = $this->dashboardService->getSalesTrend(
            $dataset,
            $filters
        );

        return response()->json([
            'message' => 'Sales trend berhasil diambil.',
            'filters' => $this->formatFilters($filters),
            'data' => $salesTrend,
        ]);
    }

    public function salesByCountry(DashboardFilterRequest $request, Dataset $dataset): JsonResponse
    {
        if ($dataset->status !== 'completed') {
            return response()->json([
                'message' => 'Dataset belum selesai diproses.',
            ], 409);
        }

        $filters = $request->validated();

        $salesByCountry = $this->dashboardService->getSalesByCountry(
            $dataset,
            $filters
        );

        return response()->json([
            'message' => 'Sales by country berhasil diambil.',
            'filters' => $this->formatFilters($filters),
            'data' => $salesByCountry,
        ]);
    }

    public function topProducts(DashboardFilterRequest $request, Dataset $dataset): JsonResponse
    {
        if ($dataset->status !== 'completed') {
            return response()->json([
                'message' => 'Dataset belum selesai diproses.',
            ], 409);
        }

        $filters = $request->validated();

        $topProducts = $this->dashboardService->getTopProducts(
            $dataset,
            $filters
        );

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

    private function formatFilters(array $filters): array
    {
        return [
            'date_from' => $filters['date_from'] ?? null,
            'date_to' => $filters['date_to'] ?? null,
            'country' => $filters['country'] ?? null,
        ];
    }
}
