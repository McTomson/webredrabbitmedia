'use client';

import React from 'react';

const comparisonData = [
    {
        criterion: 'Startpreis (Setup)',
        diy: '0 €',
        builder: '0 €',
        agency: 'ab 790 €'
    },
    {
        criterion: 'Monatliche Kosten',
        diy: '10 - 20 € (Hosting)',
        builder: '15 - 50 € (Dauerhaft)',
        agency: '0 € (Vercel Hosting)'
    },
    {
        criterion: 'Zeitaufwand (Erstellung)',
        diy: '40 - 80 Stunden',
        builder: '10 - 20 Stunden',
        agency: '0 Stunden (Full Service)'
    },
    {
        criterion: 'Design-Qualität',
        diy: 'Hängt vom Talent ab',
        builder: 'Standard-Templates',
        agency: 'Premium & Individuell'
    },
    {
        criterion: 'Technische Basis',
        diy: 'Oft WordPress (Wartungsintensiv)',
        builder: 'Baukasten (Proprietär)',
        agency: 'Next.js (High-End)'
    },
    {
        criterion: 'Ladezeit (Speed)',
        diy: 'Langsam (ohne Optimierung)',
        builder: 'Mittel (viel Code-Ballast)',
        agency: 'Extrem schnell (< 1s)'
    },
    {
        criterion: 'Google Ranking (SEO)',
        diy: 'Erfordert viel Fachwissen',
        builder: 'Begrenzte Möglichkeiten',
        agency: 'Technisch perfekt optimiert'
    },
    {
        criterion: 'Eigentum',
        diy: '100% Dir',
        builder: 'Mietmodell (Nie deins)',
        agency: '100% Dir'
    },
    {
        criterion: 'Anpassbarkeit',
        diy: 'Hoch (aber schwer)',
        builder: 'Stark begrenzt',
        agency: 'Unbegrenzt'
    }
];

export default function RegionComparisonTable() {
    return (
        <div className="region-table-wrapper">
            <h3 className="section-title">Vergleich: Der Weg zur neuen Website</h3>

            {/* Desktop Table */}
            <div className="table-container">
                <table className="comparison-table">
                    <thead>
                        <tr>
                            <th>Kriterium</th>
                            <th className="col-diy">Selber machen</th>
                            <th className="col-builder">Baukasten (Wix/Jimdo)</th>
                            <th className="col-agency">Red Rabbit Media</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comparisonData.map((row, index) => (
                            <tr key={index}>
                                <td className="cell-criterion">{row.criterion}</td>
                                <td className="cell-diy">{row.diy}</td>
                                <td className="cell-builder">{row.builder}</td>
                                <td className="cell-agency">{row.agency}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="mobile-cards">
                {comparisonData.map((row, index) => (
                    <div key={index} className="mobile-card">
                        <div className="card-header">{row.criterion}</div>
                        <div className="card-row">
                            <span className="label">Selber:</span>
                            <span className="value">{row.diy}</span>
                        </div>
                        <div className="card-row">
                            <span className="label">Baukasten:</span>
                            <span className="value">{row.builder}</span>
                        </div>
                        <div className="card-row highlight">
                            <span className="label">Agentur:</span>
                            <span className="value bold">{row.agency}</span>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
        .region-table-wrapper {
          margin: 3rem 0;
          font-family: var(--font-sans, sans-serif);
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        /* Desktop Styles */
        .table-container {
          overflow-x: auto;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          border-radius: 12px;
        }

        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          min-width: 600px;
        }

        th {
          padding: 1rem;
          text-align: left;
          color: white;
          font-weight: 600;
        }

        th:first-child { background: #334155; border-top-left-radius: 12px; }
        .col-diy { background: #64748b; }
        .col-builder { background: #ca8a04; }
        .col-agency { background: #dc2626; border-top-right-radius: 12px; }

        td {
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
          font-size: 0.95rem;
        }

        .cell-criterion { font-weight: 600; color: #1e293b; background: #f8fafc; }
        .cell-diy { background: #f1f5f9; color: #475569; }
        .cell-builder { background: #fefce8; color: #854d0e; }
        .cell-agency { background: #fef2f2; color: #991b1b; font-weight: 600; }

        /* Mobile Styles */
        .mobile-cards { display: none; }

        @media (max-width: 768px) {
          .table-container { display: none; }
          .mobile-cards { display: flex; flex-direction: column; gap: 1rem; }
          
          .mobile-card {
            background: white;
            padding: 1.5rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            border: 1px solid #e2e8f0;
          }

          .card-header {
            font-weight: 700;
            font-size: 1.1rem;
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #f1f5f9;
            color: #1e293b;
          }

          .card-row {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            border-bottom: 1px solid #f8fafc;
          }

          .label { font-size: 0.9rem; color: #64748b; }
          .value { font-size: 0.95rem; color: #334155; text-align: right; }
          
          .highlight {
            background: #fef2f2;
            margin: 0 -1.5rem -1.5rem -1.5rem;
            padding: 1rem 1.5rem;
            border-radius: 0 0 12px 12px;
            border-top: 1px solid #fee2e2;
          }
          
          .bold { font-weight: 700; color: #dc2626; }
        }
      `}</style>
        </div>
    );
}
