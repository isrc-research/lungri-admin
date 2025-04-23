"use client";

import { api } from "@/trpc/react";
import { useEffect, useState } from "react";
import { IdCardGrid } from "@/components/id-card/id-card-grid";

type Enumerator = {
  id: string;
  name: string;
  userName: string;
  role: string | null;
  phoneNumber: string | null;
  email: string | null;
  isActive: boolean | null;
  wardNumber: string | null;
  avatar: string | null;
  nepaliName: string | null;
  nepaliAddress: string | null;
  nepaliPhone: string | null;
  area: {
    id: string;
    code: string;
    wardNumber: string;
    areaStatus: string;
  } | null;
};

export default function PrintIDCard() {
  const [filteredEnumerators, setFilteredEnumerators] = useState<Enumerator[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  // Alternative approach - fetch all enumerators at once
  const allEnumeratorsQuery = api.enumerator.getAllEnumerators.useQuery();

  useEffect(() => {
    if (allEnumeratorsQuery.data) {
      // Filter enumerators to only include those with both avatar and nepaliName
      const filtered = allEnumeratorsQuery.data.filter(
        (enumerator) =>
          !!enumerator.avatar &&
          !!enumerator.nepaliName &&
          !!enumerator.nepaliAddress &&
          !!enumerator.nepaliPhone,
      );

      setFilteredEnumerators(filtered);
      setIsLoading(false);
    }
  }, [allEnumeratorsQuery.data]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 print:hidden">
        ID Card Printing Page
      </h1>

      {isLoading ? (
        <p className="text-gray-600 print:hidden">Loading enumerator data...</p>
      ) : filteredEnumerators.length > 0 ? (
        <div className="mb-4">
          <p className="text-green-600 font-medium mb-2 print:hidden">
            Found {filteredEnumerators.length} enumerators with complete profile
            data.
          </p>

          {/* Print information and controls - will be hidden when printing */}
          <div className="mt-4 mb-6 print:hidden">
            <button
              onClick={() => window.print()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Print ID Cards
            </button>
            <p className="text-xs text-gray-500 mt-2">
              ID cards will be arranged in a 3x2 grid on A4 paper
            </p>

            {/* Enumerator list for reference */}
            <div className="mt-4">
              <h3 className="font-semibold">Enumerators to be printed:</h3>
              <ul className="list-disc pl-5 mt-2">
                {filteredEnumerators.map((enumerator) => (
                  <li key={enumerator.id} className="mb-1">
                    {enumerator.nepaliName} ({enumerator.name}) -{" "}
                    {enumerator.userName}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ID Card Grid for printing */}
          <div className="print-container">
            <IdCardGrid enumerators={filteredEnumerators} />
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 print:hidden">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                No enumerators found with complete profile data. Please update
                the enumerator profiles before printing ID cards.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Global print styles */}
      <style jsx global>{`
        @media print {
          html,
          body {
            width: 210mm;
            height: 297mm;
            margin: 0;
            padding: 0;
          }

          body * {
            visibility: hidden;
          }

          .print-container,
          .print-container * {
            visibility: visible;
          }

          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
          }

          @page {
            size: A4;
            margin: 0mm;
          }
        }
      `}</style>
    </div>
  );
}
