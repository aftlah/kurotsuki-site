"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";

const initialLogs = [
  { id: 1, member: "John Doe", action: "Check In", time: "10:30 AM", status: "Success" },
  { id: 2, member: "Jane Smith", action: "Check Out", time: "09:15 AM", status: "Success" },
  { id: 3, member: "Bob Wilson", action: "Check In", time: "08:45 AM", status: "Success" },
];

export default function AdminPage() {
  const [logs, setLogs] = useState(initialLogs);
  const [selectedMember, setSelectedMember] = useState("");

  const handleCheckIn = () => {
    if (!selectedMember) return;
    setLogs([
      {
        id: logs.length + 1,
        member: selectedMember,
        action: "Check In",
        time: new Date().toLocaleTimeString(),
        status: "Success",
      },
      ...logs,
    ]);
    setSelectedMember("");
  };

  const handleCheckOut = () => {
    if (!selectedMember) return;
    setLogs([
      {
        id: logs.length + 1,
        member: selectedMember,
        action: "Check Out",
        time: new Date().toLocaleTimeString(),
        status: "Success",
      },
      ...logs,
    ]);
    setSelectedMember("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white-soft">Panel Admin</h2>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-white-soft">
          Catat Kehadiran Anggota
        </h3>
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            className="flex-1 rounded-xl border border-border bg-bg-secondary px-4 py-3 text-white-soft transition-colors focus:border-crimson focus:outline-none"
          >
            <option value="">Pilih Anggota</option>
            <option value="John Doe">John Doe</option>
            <option value="Jane Smith">Jane Smith</option>
            <option value="Bob Wilson">Bob Wilson</option>
            <option value="VIP Member">VIP Member</option>
            <option value="Owner">Owner</option>
          </select>
          <div className="flex gap-3">
            <Button onClick={handleCheckIn} className="flex-1 sm:w-auto">
              Check In
            </Button>
            <Button
              onClick={handleCheckOut}
              variant="outline"
              className="flex-1 sm:w-auto"
            >
              Check Out
            </Button>
          </div>
        </div>

        <h4 className="text-md mb-4 font-semibold text-white-soft">
          Riwayat Kehadiran
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-muted">
                  Anggota
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-muted">
                  Aksi
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-muted">
                  Waktu
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-muted">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-border/50 transition-colors hover:bg-bg-secondary/30"
                >
                  <td className="px-4 py-4 font-medium text-white-soft">
                    {log.member}
                  </td>
                  <td className="px-4 py-4 text-gray-muted">{log.action}</td>
                  <td className="px-4 py-4 text-gray-muted">{log.time}</td>
                  <td className="px-4 py-4">
                    <Badge
                      variant={log.status === "Success" ? "success" : "crimson"}
                    >
                      {log.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
