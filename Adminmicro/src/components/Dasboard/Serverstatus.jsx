// admin/AdminComponents/ServerStatus.jsx
import React, { memo, useMemo } from "react";

const Serverstatus = memo(() => {
  const status = useMemo(
    () => ({
      server: "Online",
      db: "Connected",
      lastBackup: "2026-01-20 02:30",
      load: "0.54",
    }),
    [],
  );

  return (
    <div className="bg-white border rounded-xl p-4 shadow-sm min-h-[120px]">
      <h3 className="font-bold mb-2">System Status</h3>
      <div className="text-sm space-y-2">
        <div className="flex justify-between">
          <span>Server</span>
          <span className="text-green-600 font-medium">{status.server}</span>
        </div>
        <div className="flex justify-between">
          <span>Database</span>
          <span className="text-green-600 font-medium">{status.db}</span>
        </div>
        <div className="flex justify-between">
          <span>Last Backup</span>
          <span className="text-sm text-gray-600">{status.lastBackup}</span>
        </div>
        <div className="flex justify-between">
          <span>Load</span>
          <span className="text-sm text-gray-600">{status.load}</span>
        </div>
      </div>
    </div>
  );
});

export default Serverstatus;
