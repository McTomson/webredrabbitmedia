'use client';

import React from 'react';

interface ComparisonRow {
  criterion: string;
  herold: string | React.ReactNode;
  agency: string | React.ReactNode;
}

interface ComparisonTableProps {
  data: ComparisonRow[];
  title?: string;
}

export default function ComparisonTable({ data, title }: ComparisonTableProps) {
  return (
    <div className="comparison-table-wrapper">
      {title && <h3 className="comparison-table-title">{title}</h3>}

      {/* Desktop Table */}
      <div className="comparison-table-desktop">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Kriterium</th>
              <th className="herold-column">Herold Webseite</th>
              <th className="agency-column">Red Rabbit Media Agentur</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td className="criterion-cell">{row.criterion}</td>
                <td className="herold-cell">{row.herold}</td>
                <td className="agency-cell">{row.agency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="comparison-table-mobile">
        {data.map((row, index) => (
          <div key={index} className="comparison-card">
            <div className="comparison-card-header">{row.criterion}</div>
            <div className="comparison-card-row">
              <div className="comparison-card-label">Herold</div>
              <div className="comparison-card-value herold-value">{row.herold}</div>
            </div>
            <div className="comparison-card-row">
              <div className="comparison-card-label">Red Rabbit</div>
              <div className="comparison-card-value agency-value">{row.agency}</div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .comparison-table-wrapper {
          margin: 2rem 0;
          width: 100%;
        }

        .comparison-table-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: var(--text-primary, #1a1a1a);
        }

        /* Desktop Table */
        .comparison-table-desktop {
          display: block;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .comparison-table thead {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .comparison-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.95rem;
          white-space: nowrap;
        }

        .comparison-table th:first-child {
          width: 30%;
        }

        .comparison-table th.herold-column {
          background: rgba(239, 68, 68, 0.15);
        }

        .comparison-table th.agency-column {
          background: rgba(34, 197, 94, 0.15);
        }

        .comparison-table tbody tr {
          border-bottom: 1px solid #e5e7eb;
          transition: background-color 0.2s ease;
        }

        .comparison-table tbody tr:hover {
          background-color: #f9fafb;
        }

        .comparison-table tbody tr:last-child {
          border-bottom: none;
        }

        .comparison-table td {
          padding: 1rem;
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .criterion-cell {
          font-weight: 600;
          color: #374151;
        }

        .herold-cell {
          background-color: #fef2f2;
          color: #991b1b;
        }

        .agency-cell {
          background-color: #f0fdf4;
          color: #166534;
        }

        /* Mobile Cards */
        .comparison-table-mobile {
          display: none;
        }

        @media (max-width: 768px) {
          .comparison-table-desktop {
            display: none;
          }

          .comparison-table-mobile {
            display: block;
          }

          .comparison-card {
            background: white;
            border-radius: 12px;
            padding: 1.25rem;
            margin-bottom: 1rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .comparison-card-header {
            font-weight: 700;
            font-size: 1rem;
            color: #1f2937;
            margin-bottom: 1rem;
            padding-bottom: 0.75rem;
            border-bottom: 2px solid #e5e7eb;
          }

          .comparison-card-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 0;
            border-bottom: 1px solid #f3f4f6;
          }

          .comparison-card-row:last-child {
            border-bottom: none;
          }

          .comparison-card-label {
            font-weight: 600;
            font-size: 0.875rem;
            color: #6b7280;
            flex-shrink: 0;
            margin-right: 1rem;
          }

          .comparison-card-value {
            font-size: 0.875rem;
            text-align: right;
            flex-grow: 1;
          }

          .herold-value {
            color: #991b1b;
            background-color: #fef2f2;
            padding: 0.5rem;
            border-radius: 6px;
          }

          .agency-value {
            color: #166534;
            background-color: #f0fdf4;
            padding: 0.5rem;
            border-radius: 6px;
          }
        }

        @media (max-width: 480px) {
          .comparison-table-wrapper {
            margin: 1.5rem 0;
            width: 100%;
          }

          .comparison-card {
            border-radius: 0;
            margin-bottom: 0.75rem;
          }

          .comparison-card-row {
            flex-direction: column;
            align-items: flex-start;
          }

          .comparison-card-label {
            margin-bottom: 0.5rem;
          }

          .comparison-card-value {
            width: 100%;
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
}
