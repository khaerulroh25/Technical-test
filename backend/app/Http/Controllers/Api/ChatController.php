<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\ChatRequest;
use App\Models\Dataset;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use App\Services\DashboardService;

class ChatController extends Controller
{
    private const ALLOWED_INTENTS = [
        'overview',
        'sales_trend',
        'sales_by_country',
        'top_products',
        'unsupported',
    ];

    public function __construct(
        private DashboardService $dashboardService
    ) {
    }
    public function chat(ChatRequest $request, Dataset $dataset): JsonResponse
    {
        if ($dataset->status !== 'completed') {
            return response()->json([
                'message' => 'Dataset belum selesai diproses.',
            ], 409);
        }

        $question = $request->validated('message');

        $response = Http::withToken(
            config('services.openrouter.key')
        )
            ->acceptJson()
            ->timeout(60)
            ->post(
                'https://openrouter.ai/api/v1/chat/completions',
                [
                    'model' => config('services.openrouter.model'),
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => $this->getIntentPrompt(),
                        ],
                        [
                            'role' => 'user',
                            'content' => $question,
                        ],
                    ],
                    'temperature' => 0,
                ]
            );

        if ($response->failed()) {
            return response()->json([
                'message' => 'Gagal memproses pertanyaan.',
                'error' => $response->json(),
            ], $response->status());
        }

        $content = $response->json(
            'choices.0.message.content',
            ''
        );

        $analysis = json_decode($content, true);

        if (!is_array($analysis)) {
            return response()->json([
                'message' => 'AI menghasilkan format yang tidak valid.',
                'raw' => $content,
            ], 422);
        }

        $intent = $analysis['intent'] ?? 'unsupported';
        $metric = $analysis['metric'] ?? null;

        if (!in_array($intent, self::ALLOWED_INTENTS, true)) {
            $intent = 'unsupported';
        }

        $filters = [
            'date_from' => data_get(
                $analysis,
                'filters.date_from'
            ),

            'date_to' => data_get(
                $analysis,
                'filters.date_to'
            ),

            'country' => data_get(
                $analysis,
                'filters.country'
            ),
        ];

        if ($intent === 'unsupported') {
            return response()->json([
                'message' => 'Pertanyaan tidak didukung.',
                'data' => [
                    'question' => $question,
                    'intent' => $intent,
                    'answer' => 'Maaf, saya hanya dapat menjawab pertanyaan terkait data penjualan.',
                ],
            ]);
        }

        $data = match ($intent) {
            'overview' => $this->dashboardService->getOverview(
                $dataset,
                $filters
            ),

            'sales_trend' => $this->dashboardService->getSalesTrend(
                $dataset,
                $filters
            ),

            'sales_by_country' => $this->dashboardService->getSalesByCountry(
                $dataset,
                $filters
            ),

            'top_products' => $this->dashboardService->getTopProducts(
                $dataset,
                $filters
            ),
        };

        $answer = $this->generateAnswer(
            $intent,
            $metric,
            $data,
            $filters
        );

        return response()->json([
            'message' => 'Pertanyaan berhasil dianalisis.',
            'data' => [
                'question' => $question,
                'intent' => $intent,
                'metric' => $metric,
                'data' => $data,
                'filters' => $filters,
                'answer' => $answer,
            ],
        ]);
    }

    private function generateAnswer(
        string $intent,
        ?string $metric,
        mixed $data,
        array $filters
    ): string {
        $country = $filters['country'];

        return match ($intent) {
            'overview' =>
                $this->generateOverviewAnswer(
                    $metric,
                    $data,
                    $country
                ),

            'sales_trend' =>
                'Berikut adalah tren penjualan berdasarkan data yang tersedia.',

            'sales_by_country' =>
                'Berikut adalah data penjualan berdasarkan negara.',

            'top_products' =>
                'Berikut adalah produk dengan penjualan tertinggi'
                . ($country ? " di {$country}" : '')
                . '.',

            default =>
                'Data tidak ditemukan.',
        };
    }

    private function generateOverviewAnswer(
        ?string $metric,
        mixed $data,
        ?string $country
    ): string {
        if (empty($data)) {
            return 'Data tidak ditemukan.';
        }

        $location = $country
            ? " di {$country}"
            : '';

        return match ($metric) {
            'total_revenue' => sprintf(
                'Total pendapatan%s adalah %s.',
                $location,
                number_format(
                    $data['total_revenue'] ?? 0,
                    2,
                    ',',
                    '.'
                )
            ),

            'total_orders' => sprintf(
                'Total order%s adalah %s.',
                $location,
                number_format(
                    $data['total_orders'] ?? 0,
                    0,
                    ',',
                    '.'
                )
            ),

            'total_products_sold' => sprintf(
                'Total produk terjual%s adalah %s.',
                $location,
                number_format(
                    $data['products_sold'] ?? 0,
                    0,
                    ',',
                    '.'
                )
            ),

            'total_customers' => sprintf(
                'Total pelanggan%s adalah %s.',
                $location,
                number_format(
                    $data['total_customers'] ?? 0,
                    0,
                    ',',
                    '.'
                )
            ),

            default => 'Metrik yang ditanyakan tidak ditemukan.',
        };
    }
    private function getIntentPrompt(): string
    {
        return <<<'PROMPT'
            Kamu adalah analis pertanyaan untuk dashboard penjualan.

            Tentukan intent berdasarkan METRIK UTAMA yang ditanyakan.

            Intent yang tersedia:
            - overview
            - sales_trend
            - sales_by_country
            - top_products
            - unsupported

            METRIK yang tersedia:
            - total_revenue
            - total_orders
            - total_products_sold
            - total_customers

            ATURAN INTENT:

            1. overview

            Gunakan jika user menanyakan:
            - total pendapatan atau total revenue
            - total order
            - total produk yang terjual
            - jumlah produk yang terjual
            - total pelanggan
            - jumlah pelanggan

            Tentukan metric berdasarkan pertanyaan:

            - total pendapatan atau revenue
            → total_revenue

            - total order atau jumlah order
            → total_orders

            - total produk terjual atau jumlah produk terjual
            → total_products_sold

            - total pelanggan atau jumlah pelanggan
            → total_customers

            Contoh:

            "Berapa total produk yang terjual?"
            → intent = overview
            → metric = total_products_sold

            "Berapa total produk yang terjual di Australia?"
            → intent = overview
            → metric = total_products_sold
            → country = Australia

            "Berapa total pendapatan di France?"
            → intent = overview
            → metric = total_revenue
            → country = France

            "Berapa total pelanggan di Australia?"
            → intent = overview
            → metric = total_customers
            → country = Australia


            2. sales_trend

            Gunakan jika user menanyakan:
            - tren penjualan
            - perubahan penjualan berdasarkan waktu
            - pendapatan per bulan
            - perkembangan penjualan

            Untuk intent ini:
            → metric = null


            3. sales_by_country

            Gunakan HANYA jika user ingin:
            - membandingkan penjualan antar negara
            - mengetahui negara dengan penjualan tertinggi
            - melihat distribusi pendapatan berdasarkan negara

            Contoh:

            "Negara mana dengan penjualan tertinggi?"
            → sales_by_country

            "Bagaimana penjualan berdasarkan negara?"
            → sales_by_country

            Untuk intent ini:
            → metric = null


            4. top_products

            Gunakan jika user menanyakan:
            - produk paling laris
            - produk paling banyak terjual
            - ranking produk

            Contoh:

            "Produk apa yang paling laris di Australia?"
            → top_products dengan country = Australia

            Untuk intent ini:
            → metric = null


            ATURAN FILTER:

            - Penyebutan negara adalah FILTER, bukan otomatis intent sales_by_country.
            - Jika negara disebutkan, masukkan ke country.
            - Jika tanggal disebutkan, masukkan ke date_from dan date_to.
            - Jika filter tidak disebutkan, isi null.

            ATURAN METRIC:

            - metric wajib diisi untuk intent overview.
            - metric harus null untuk intent selain overview.
            - Jangan memilih metric yang tidak ditanyakan user.

            Balas HANYA JSON valid:

            {
                "intent": "overview",
                "metric": "total_customers",
                "filters": {
                    "date_from": null,
                    "date_to": null,
                    "country": null
                }
            }
            PROMPT;
    }
}
