import { CalendarDays, ChevronDown } from "lucide-react";
import { useState, type FormEvent } from "react";

function DashboardFilter() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [country, setCountry] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const filters = {
      dateFrom,
      dateTo,
      country,
    };

    console.log("Applied filters:", filters);
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
            <option value="United Kingdom">United Kingdom</option>
            <option value="France">France</option>
            <option value="Germany">Germany</option>
            <option value="Netherlands">Netherlands</option>
            <option value="Spain">Spain</option>
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
