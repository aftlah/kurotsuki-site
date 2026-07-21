"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

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
    const newLog = {
      id: logs.length + 1,
      member: selectedMember,
      action: "Check In",
      time: new Date().toLocaleTimeString(),
      status: "Success",
    };
    setLogs([newLog, ...logs]);
    setSelectedMember("");
  };

  const handleCheckOut = () => {
    if (!selectedMember) return;
    const newLog = {
      id: logs.length + 1,
      member: selectedMember,
      action: "Check Out",
      time: new Date().toLocaleTimeString(),
      status: "Success",
    };
    setLogs([newLog, ...logs]);
    setSelectedMember("");
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white-soft">Panel Admin</h2>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white-soft mb-4">Catat Kehadiran Anggota</h3>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-bg-secondary border border-border text-white-soft focus:outline-none focus:border-crimson transition-colors"
          >
            <option value="">Pilih Anggota</option>
            <option value="John Doe">John Doe</option>
            <option value="Jane Smith">Jane Smith</option>
            <option value="Bob Wilson">Bob Wilson</option>
            <option value="VIP Member">VIP Member</option>
            <option value="Owner">Owner</option>
          </select>
          <div className="flex gap-3">
            <Button onClick={handleCheckIn} className="flex-1 sm:w-auto">Check In</Button>
            <Button onClick={handleCheckOut} variant="outline" className="flex-1 sm:w-auto">Check Out</Button>
          </div>
        </div>

        <h4 className="text-md font-semibold text-white-soft mb-4">Riwayat Kehadiran</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-gray-muted text-sm font-medium">Anggota</th>
                <th className="text-left py-3 px-4 text-gray-muted text-sm font-medium">Aksi</th>
                <th className="text-left py-3 px-4 text-gray-muted text-sm font-medium">Waktu</th>
                <th className="text-left py-3 px-4 text-gray-muted text-sm font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-border/50 hover:bg-bg-secondary/30 transition-colors">
                  <td className="py-4 px-4 text-white-soft font-medium">{log.member}</td>
                  <td className="py-4 px-4 text-gray-muted">{log.action}</td>
                  <td className="py-4 px-4 text-gray-muted">{log.time}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${log.status === "Success" ? "bg-success/20 text-success" : "bg-danger/20 text-danger"}`}>
                      {log.status}
                    </span>
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
