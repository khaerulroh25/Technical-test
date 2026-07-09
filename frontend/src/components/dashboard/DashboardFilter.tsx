import { CalendarDays, ChevronDown } from "lucide-react";
import { useState, useEffect, type SubmitEvent } from "react";
import { type DashboardFilter as DashboardFilterType } from "../../types/dashboard";
import { getFilterOptions } from "../../services/dashboardService";

interface DashboardFilterProps {
  datasetId: number | null;
  onApply: (filters: DashboardFilterType) => void;
}

function DashboardFilter({ datasetId, onApply }: DashboardFilterProps) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [country, setCountry] = useState("");
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    if (!datasetId) {
      setCountries([]);
      return;
    }

    const fetchCountries = async () => {
      try {
        const data = await getFilterOptions(Number(datasetId));

        setCountries(data.countries);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCountries();
  }, [datasetId]);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (dateFrom && dateTo && dateFrom > dateTo) {
      alert("Date From tidak boleh lebih besar dari Date To.");
      return;
    }

    onApply({
      date_from: dateFrom,
      date_to: dateTo,
      country,
    });
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <h2 className="mb-5 text-lg font-semibold text-gray-900">Filter</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto]"
      >
        {/* Date From */}
        <div className="relative">
          <CalendarDays
            size={20}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="date"
            value={dateFrom}
            onChange={(event) => setDateFrom(event.target.value)}
            className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-12 pr-4 text-sm text-gray-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        {/* Date To */}
        <div className="relative">
          <CalendarDays
            size={20}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="date"
            value={dateTo}
            onChange={(event) => setDateTo(event.target.value)}
            className="h-12 w-full rounded-lg border border-gray-200 bg-white pl-12 pr-4 text-sm text-gray-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
        </div>

        {/* Country */}
        <div className="relative">
          <select
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            className="h-12 w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 pr-10 text-sm text-gray-700 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          >
            <option value="">Semua Negara</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          <ChevronDown
            size={18}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        {/* Apply Button */}
        <button
          type="submit"
          className="h-12 rounded-lg bg-orange-500 px-8 font-medium text-white transition hover:bg-orange-600 active:scale-[0.98]"
        >
          Apply
        </button>
      </form>
    </section>
  );
}

export default DashboardFilter;
