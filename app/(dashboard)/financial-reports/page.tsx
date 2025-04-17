"use client";

import { useState } from "react";
import { trialBalanceColumns } from "@/components/trial-balance-columns";
import { incomeStatementColumns } from "@/components/income-statement-columns";
import { balanceSheetColumns } from "@/components/balance-sheet-columns";
import { retainedEarningsColumns } from "@/components/retained-earnings-columns";
import { TrialBalanceTable } from "@/components/trial-balance-table";
import { IncomeStatementTable } from "@/components/income-statement-table";
import { BalanceSheetTable } from "@/components/balance-sheet-table";
import { RetainedEarningsTable } from "@/components/retained-earnings-table";
import { CalendarIcon } from "lucide-react";
import { TrialBalance } from "@/components/trial-balance-columns";
import { BalanceSheet } from "@/components/balance-sheet-columns";
import { RetainedEarnings } from "@/components/retained-earnings-columns";
import { IncomeStatement } from "@/components/income-statement-columns";
import {
  transformBalanceSheet,
  transformIncomeStatement,
} from "@/lib/account-utils";

const FinancialReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState("trial-balance");
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });
  const [trialBalanceData, setTrialBalanceData] = useState<TrialBalance[]>([]);
  const [incomeStatementData, setIncomeStatementData] = useState<
    IncomeStatement[]
  >([]);
  const [balanceSheetData, setBalanceSheetData] = useState<BalanceSheet[]>([]);
  const [retainedEarningsData, setRetainedEarningsData] = useState<
    RetainedEarnings[]
  >([]);
  const [isDateRange, setIsDateRange] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [error, setError] = useState(null);

  const tableComponents = {
    "trial-balance": TrialBalanceTable,
    "income-statement": IncomeStatementTable,
    "balance-sheet": BalanceSheetTable,
    "retained-earnings": RetainedEarningsTable,
  };

  const reports = [
    { id: "trial-balance", name: "Trial Balance", icon: "⚖️" },
    { id: "income-statement", name: "Income Statement", icon: "📈" },
    { id: "balance-sheet", name: "Balance Sheet", icon: "🏦" },
    { id: "retained-earnings", name: "Retained Earnings", icon: "💰" },
  ];

  const handleGenerate = async () => {
    setError(null);
    if (!selectedReport) {
      return;
    }

    try {
      let response;
      let endpoint = "";
      let body = {
        startDate: dateRange.start,
        endDate: isDateRange ? dateRange.end : dateRange.start,
      };

      // Set the endpoint based on selected report
      switch (selectedReport) {
        case "trial-balance":
          endpoint = "/api/trial-balance";
          break;
        case "income-statement":
          endpoint = "/api/income-statement";
          break;
        case "balance-sheet":
          endpoint = "/api/balance-sheet";
          break;
        case "retained-earnings":
          endpoint = "/api/retained-earnings";
          break;
        default:
          console.warn("Unknown report type selected.");
          return;
      }

      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        setError(error.message);
        return;
      }

      const result = await response.json();
      if (selectedReport === "trial-balance") {
        setTrialBalanceData(result);
        console.log(trialBalanceData);
      } else if (selectedReport === "income-statement") {
        setIncomeStatementData(transformIncomeStatement(result));
      } else if (selectedReport === "balance-sheet") {
        setBalanceSheetData(transformBalanceSheet(result));
      } else if (selectedReport === "retained-earnings") {
        setRetainedEarningsData([result]);
      }
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  const handleExport = () => {
    console.log("Exporting report...");
    // Implement export logic
  };

  const handleEmail = () => {
    console.log("Emailing report...");
    // Implement email logic
  };

  const handlePrint = () => {
    console.log("Printing report...");
    // Implement print logic
  };

  return (
    <div className="grid gap-6 p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Report Configuration Section */}
        <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          {/* Report Type Selection */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Select Report Type</h2>
            <div className="grid grid-cols-2 gap-4">
              {reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`p-4 rounded-lg border-2 flex flex-col items-center transition-all
                    ${
                      selectedReport === report.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                >
                  <span className="text-2xl mb-2">{report.icon}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {report.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Select Date Range</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setIsDateRange(false)}
                  className={`px-4 py-2 rounded-md ${
                    !isDateRange ? "bg-blue-500 text-white" : "bg-gray-100"
                  }`}
                >
                  Single Date
                </button>
                <button
                  onClick={() => setIsDateRange(true)}
                  className={`px-4 py-2 rounded-md ${
                    isDateRange ? "bg-blue-500 text-white" : "bg-gray-100"
                  }`}
                >
                  Date Range
                </button>
              </div>

              <button
                onClick={() => {
                  setDateRange({ start: "", end: "" });
                }}
                className=""
              >
                Remove filter
              </button>

              <div className="flex gap-4 items-center">
                <CalendarIcon className="w-6 h-6 text-gray-500" />
                <input
                  type="date"
                  className="p-2 border rounded-md"
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                />
                {isDateRange && (
                  <>
                    <span className="text-gray-500">to</span>
                    <input
                      type="date"
                      className="p-2 border rounded-md"
                      value={dateRange.end}
                      onChange={(e) =>
                        setDateRange({ ...dateRange, end: e.target.value })
                      }
                    />
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Generate Report
          </button>
        </div>

        {/* Report Preview Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          {error ? (
            <p className="text-center">{error}</p>
          ) : selectedReport === "trial-balance" ? (
            <TrialBalanceTable
              data={trialBalanceData}
              columns={trialBalanceColumns}
              globalFilter={globalFilter}
              onGlobalFilterChange={setGlobalFilter}
              onExport={handleExport}
              onEmail={handleEmail}
              onPrint={handlePrint}
            />
          ) : selectedReport === "income-statement" ? (
            <IncomeStatementTable
              data={incomeStatementData}
              columns={incomeStatementColumns}
              globalFilter={globalFilter}
              onGlobalFilterChange={setGlobalFilter}
              onExport={handleExport}
              onEmail={handleEmail}
              onPrint={handlePrint}
            />
          ) : selectedReport === "balance-sheet" ? (
            <BalanceSheetTable
              data={balanceSheetData}
              columns={balanceSheetColumns}
              globalFilter={globalFilter}
              onGlobalFilterChange={setGlobalFilter}
              onExport={handleExport}
              onEmail={handleEmail}
              onPrint={handlePrint}
            />
          ) : selectedReport === "retained-earnings" ? (
            <RetainedEarningsTable
              data={retainedEarningsData}
              columns={retainedEarningsColumns}
              globalFilter={globalFilter}
              onGlobalFilterChange={setGlobalFilter}
              onExport={handleExport}
              onEmail={handleEmail}
              onPrint={handlePrint}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default FinancialReportsPage;
