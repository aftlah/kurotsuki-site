"use client";

import { Card } from "@/components/Card";

const members = [
  { id: 1, name: "Owner", rank: "Leader", status: "Online", role: "Owner" },
  { id: 2, name: "VIP Member", rank: "Elite", status: "Online", role: "VIP" },
  { id: 3, name: "John Doe", rank: "Member", status: "Offline", role: "Member" },
  { id: 4, name: "Jane Smith", rank: "Member", status: "Online", role: "Member" },
  { id: 5, name: "Bob Wilson", rank: "Recruit", status: "Offline", role: "Member" },
];

export default function MembersPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white-soft">Daftar Anggota</h2>
      <Card className="p-6 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-gray-muted text-sm font-medium">Nama</th>
              <th className="text-left py-3 px-4 text-gray-muted text-sm font-medium">Pangkat</th>
              <th className="text-left py-3 px-4 text-gray-muted text-sm font-medium">Status</th>
              <th className="text-left py-3 px-4 text-gray-muted text-sm font-medium">Peran</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b border-border/50 hover:bg-bg-secondary/30 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center bg-bg-secondary ${member.role === "Owner" || member.role === "VIP" ? "border-gold" : "border-border"}`}>
                      <span className="text-sm font-bold text-gray-muted">{member.name.charAt(0)}</span>
                    </div>
                    <span className="text-white-soft font-medium">{member.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-muted">{member.rank}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${member.status === "Online" ? "bg-success/20 text-success" : "bg-gray-muted/20 text-gray-muted"}`}>
                    {member.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${member.role === "Owner" ? "bg-gold/20 text-gold" : member.role === "VIP" ? "bg-gold/10 text-gold" : "bg-gray-muted/10 text-gray-muted"}`}>
                    {member.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
