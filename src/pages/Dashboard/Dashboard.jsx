import React, { useRef, useState } from "react";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from "handsontable/registry";
import "handsontable/dist/handsontable.full.min.css";

// Register Handsontable modules
registerAllModules();

export default function AttendanceDashboard() {
  const hotRef = useRef(null);
  const [result, setResult] = useState({ intervals: [], totalTime: "0h 0m" });

  // Sample data pasted from Excel
  const data = [
    ["1", "Rajesh", "19", "22-10-2025", "06:53 PM"],
    ["2", "Rajesh", "19", "22-10-2025", "02:18 PM"],
    ["3", "Rajesh", "19", "22-10-2025", "01:43 PM"],
    ["4", "Rajesh", "19", "22-10-2025", "09:56 AM"],
  ];

  const headers = ["S.No", "Name", "UserId", "Date", "Time"];

  // Parse date + time string into a JS Date object
  const parseDateTime = (dateStr, timeStr) => {
    // Convert date format from DD-MM-YYYY to YYYY-MM-DD
    const [dd, mm, yyyy] = dateStr.split("-");
    return new Date(`${yyyy}-${mm}-${dd} ${timeStr}`);
  };

  // Calculate working intervals and total time
  const calculateWorkingTime = (records) => {
    // Sort records by Date + Time ascending
    const sorted = records.sort(
      (a, b) => parseDateTime(a.Date, a.Time) - parseDateTime(b.Date, b.Time)
    );

    let totalMs = 0;
    const intervals = [];

    for (let i = 0; i < sorted.length; i += 2) {
      const inRecord = sorted[i];
      const outRecord = sorted[i + 1];
      if (!outRecord) break;

      const inTime = parseDateTime(inRecord.Date, inRecord.Time);
      const outTime = parseDateTime(outRecord.Date, outRecord.Time);
      const diffMs = outTime - inTime;

      totalMs += diffMs;

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      intervals.push({
        in: inRecord.Time,
        out: outRecord.Time,
        duration: `${hours}h ${minutes}m`,
      });
    }

    const totalHours = Math.floor(totalMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));

    return { intervals, totalTime: `${totalHours}h ${totalMinutes}m` };
  };

  // Handle button click
  const handleCalculate = () => {
    const hot = hotRef.current.hotInstance;
    const currentData = hot.getData();

    // Map row arrays to objects
    const structured = currentData.map((row) =>
      headers.reduce((acc, key, i) => {
        acc[key] = row[i];
        return acc;
      }, {})
    );

    const result = calculateWorkingTime(structured);
    setResult(result);
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-semibold mb-4">Attendance Dashboard</h2>

      <HotTable
        ref={hotRef}
        data={data}
        colHeaders={headers}
        rowHeaders={true}
        width="100%"
        height="300"
        licenseKey="non-commercial-and-evaluation"
        stretchH="all"
        contextMenu={true}
        className="border border-gray-300 rounded-lg"
      />

      <button
        onClick={handleCalculate}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Calculate Working Time
      </button>

      <div className="mt-5">
        <h3 className="text-lg font-semibold mb-2">Intervals</h3>
        <ul className="list-disc list-inside">
          {result.intervals.map((item, idx) => (
            <li key={idx}>
              In: {item.in} | Out: {item.out} → Duration: {item.duration}
            </li>
          ))}
        </ul>
        <h3 className="text-lg font-semibold mt-3">
          Total Working Time: {result.totalTime}
        </h3>
      </div>
    </div>
  );
}
