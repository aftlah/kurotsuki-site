"use client";

import { Card } from "@/components/Card";
import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/Badge";

const members = [
  { id: 1, name: "Owner", rank: "Leader", status: "Online", role: "Owner" },
  { id: 2, name: "VIP Member", rank: "Elite", status: "Online", role: "VIP" },
  { id: 3, name: "John Doe", rank: "Member", status: "Offline", role: "Member" },
  { id: 4, name: "Jane Smith", rank: "Member", status: "Online", role: "Member" },
  { id: 5, name: "Bob Wilson", rank: "Recruit", status: "Offline", role: "Member" },
];

function getRoleBadge(role: string) {
  if (role === "Owner") return <Badge variant="gold">Owner</Badge>;
  if (role === "VIP") return <Badge variant="gold">VIP</Badge>;
  return <Badge variant="black">{role}</Badge>;
}

export default function MembersPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white-soft">Daftar Anggota</h2>
      <Card className="overflow-x-auto p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-muted">
                Nama
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-muted">
                Pangkat
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-muted">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-muted">
                Peran
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr
                key={member.id}
                className="border-b border-border/50 transition-colors hover:bg-bg-secondary/30"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={member.name}
                      size="sm"
                      borderColor={
                        member.role === "Owner" || member.role === "VIP"
                          ? "gold"
                          : "gray"
                      }
                      status={
                        member.status === "Online" ? "online" : "offline"
                      }
                    />
                    <span className="font-medium text-white-soft">
                      {member.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-muted">{member.rank}</td>
                <td className="px-4 py-4">
                  <Badge
                    variant={
                      member.status === "Online" ? "success" : "black"
                    }
                  >
                    {member.status}
                  </Badge>
                </td>
                <td className="px-4 py-4">{getRoleBadge(member.role)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
