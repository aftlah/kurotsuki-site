"use client";

import { Card } from "@/components/Card";
import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/Badge";
import { KatanaDivider } from "@/components/KatanaDivider";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const textColorMap = {
  gold: "text-gold",
  crimson: "text-crimson",
  gray: "text-gray-muted",
} as const;

const members = [
  {
    name: "Owner",
    role: "Oyabun",
    status: "online" as const,
    borderColor: "gold" as const,
  },
  {
    name: "Member 1",
    role: "Kyodai",
    status: "offline" as const,
    borderColor: "gray" as const,
  },
  {
    name: "VIP",
    role: "Wakagashira",
    status: "online" as const,
    borderColor: "gold" as const,
  },
];

export default function DashboardPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto grid max-w-7xl grid-cols-1 gap-8 xl:grid-cols-4"
    >
      <div className="space-y-8 xl:col-span-3">
        <motion.div variants={itemVariants}>
          <Card className="relative overflow-hidden bg-gradient-to-br from-bg-secondary to-bg-primary p-8">
            <div className="absolute inset-0 animate-pan-bg opacity-[0.03]">
              <svg className="h-full w-full" viewBox="0 0 100 100">
                <defs>
                  <pattern
                    id="seigaiha-dash-hero"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle
                      cx="10"
                      cy="10"
                      r="8"
                      fill="none"
                      stroke="var(--color-crimson)"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#seigaiha-dash-hero)" />
              </svg>
            </div>

            <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/4 rounded-full bg-crimson/10 blur-3xl" />

            <div className="relative z-10">
              <Badge variant="crimson" className="mb-4">
                MEMBER
              </Badge>
              <h2 className="mb-2 text-3xl font-bold tracking-wide text-white-soft">
                Welcome to Kurotsuki-Kai
              </h2>
              <p className="mb-2 max-w-xl text-lg font-light text-gray-muted">
                Perjalanan Anda dalam persekutuan dimulai di sini.
              </p>
              <p className="max-w-xl text-sm tracking-wide text-crimson">
                Honor, disiplin, dan tradisi membimbing kita.
              </p>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <motion.div variants={itemVariants}>
            <Card className="flex h-full flex-col justify-between p-8" hoverEffect>
              <h3 className="mb-6 flex items-center gap-3 text-lg font-bold tracking-widest text-white-soft">
                <div className="h-2 w-2 rounded-full bg-crimson shadow-[0_0_8px_var(--color-crimson)]" />
                VITALITY
              </h3>

              <div className="relative mb-8 flex justify-center">
                <div className="absolute inset-0 rounded-full bg-crimson/5 blur-xl" />
                <div className="relative h-40 w-40">
                  <svg
                    className="h-full w-full -rotate-90 transform"
                    viewBox="0 0 100 100"
                  >
                    <defs>
                      <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--color-dragon-red)" />
                        <stop offset="100%" stopColor="var(--color-crimson-dark)" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="var(--color-border)"
                      strokeWidth="6"
                    />
                    <motion.circle
                      initial={{ strokeDashoffset: 251.2 }}
                      animate={{ strokeDashoffset: 75.36 }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#ringGrad)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="251.2"
                      style={{
                        filter: "drop-shadow(0 0 4px rgba(227,28,45,0.4))",
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl font-black text-white-soft drop-shadow-md">
                        70
                      </div>
                      <div className="mt-1 text-xs font-medium uppercase tracking-widest text-crimson">
                        Points
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-8">
                {[
                  { label: "12 Streak", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
                  {
                    label: "5h Focus",
                    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                  },
                ].map((stat) => (
                  <div key={stat.label} className="group text-center">
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-glass shadow-lg transition-all duration-300 group-hover:border-crimson/50 group-hover:text-white-soft text-gray-muted">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={stat.icon}
                        />
                      </svg>
                    </div>
                    <div className="text-xs font-medium text-gray-muted">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col justify-center space-y-4">
            <h3 className="mb-2 px-2 text-lg font-bold tracking-widest text-white-soft">
              COMMUNIQUÉ
            </h3>
            {[
              {
                title: "New Event",
                desc: "Gathering at the old shrine.",
                accent: true,
              },
              {
                title: "Resource",
                desc: "Guide to inner discipline.",
                accent: false,
              },
            ].map((item) => (
              <Card
                key={item.title}
                className="flex cursor-pointer items-center gap-5 p-5"
                hoverEffect
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border transition-transform group-hover:scale-110 ${
                    item.accent
                      ? "border-crimson/30 bg-crimson-dark/30 text-crimson shadow-[0_0_10px_var(--color-glow)]"
                      : "border-border bg-surface-glass-light text-gray-muted"
                  }`}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold tracking-wider text-white-soft">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-gray-muted">{item.desc}</p>
                </div>
              </Card>
            ))}
          </motion.div>
        </div>

        <motion.div variants={itemVariants}>
          <KatanaDivider />
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { title: "TRADITION", desc: "The way of the sword" },
            { title: "DISCIPLINE", desc: "Daily practice routine" },
            { title: "HONOR", desc: "Core values of the society" },
          ].map((item) => (
            <motion.div key={item.title} variants={itemVariants}>
              <Card className="group h-full cursor-pointer p-5" hoverEffect>
                <div className="relative mb-5 h-32 overflow-hidden rounded-xl bg-gradient-to-br from-crimson-dark/20 to-bg-secondary">
                  <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <svg
                      className="h-16 w-16 text-crimson"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2L9 21l3 1 3-1z" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-primary/80" />
                  <div className="absolute bottom-0 left-0 h-1 w-full origin-left scale-x-0 bg-crimson-dark transition-transform duration-500 group-hover:scale-x-100" />
                </div>
                <h4 className="mb-1 text-sm font-bold tracking-widest text-white-soft">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-muted">{item.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div variants={itemVariants} className="xl:col-span-1">
        <Card className="h-full border-border/50 p-6">
          <h3 className="mb-8 text-sm font-bold uppercase tracking-widest text-gray-muted">
            Active Syndicate
          </h3>
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.name}
                className="group flex cursor-pointer items-center gap-4 rounded-lg p-2 -mx-2 transition-colors hover:bg-white/5"
              >
                <Avatar
                  name={member.name}
                  size="md"
                  borderColor={member.borderColor}
                  status={member.status}
                />
                <div className="flex-1">
                  <p className="text-sm font-bold tracking-wide text-white-soft transition-colors group-hover:text-crimson">
                    {member.name}
                  </p>
                  <p
                    className={`mt-0.5 text-xs uppercase tracking-wider ${textColorMap[member.borderColor]}`}
                  >
                    {member.role}
                  </p>
                </div>
                {member.borderColor === "gold" && (
                  <Badge variant="gold">VIP</Badge>
                )}
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
