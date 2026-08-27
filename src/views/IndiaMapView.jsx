import React from 'react';
import { IndiaMap } from '../components/IndiaMap';
import { MapPin, Globe } from 'lucide-react';

export const IndiaMapView = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="flex-between">
        <div>
          <h2>India Client Network & Geographic Distribution</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Real-time geospatial mapping of Auco & Aiwa clients across Indian states, business valuation, and order density.
          </p>
        </div>
      </div>

      <IndiaMap />
    </div>
  );
};
