"use client";

import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { KatanaDivider } from "@/components/KatanaDivider";
import { EmptyState } from "@/components/EmptyState";
import { motion } from "framer-motion";
import { useTranslation } from "@/i18n/provider";

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

export default function DashboardPage() {
  const { t } = useTranslation();

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
                {t("dashboard.welcomeBadge")}
              </Badge>
              <h2 className="mb-2 text-3xl font-bold tracking-wide text-white-soft">
                {t("dashboard.welcomeTitle")}
              </h2>
              <p className="mb-2 max-w-xl text-lg font-light text-gray-muted">
                {t("dashboard.welcomeBody")}
              </p>
              <p className="max-w-xl text-sm tracking-wide text-crimson">
                {t("dashboard.welcomeTagline")}
              </p>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <motion.div variants={itemVariants}>
            <Card className="flex h-full flex-col justify-between p-8" hoverEffect>
              <h3 className="font-accent mb-6 flex items-center gap-3 text-lg font-bold tracking-widest text-white-soft">
                <div className="h-2 w-2 rounded-full bg-crimson shadow-[0_0_8px_var(--color-crimson)]" />
                {t("dashboard.vitality")}
              </h3>

              <div className="relative mb-8 flex justify-center">
                <div className="absolute inset-0 rounded-full bg-crimson/5 blur-xl" />
                <div className="relative h-40 w-40">
                  <svg
                    className="h-full w-full -rotate-90 transform"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="var(--color-border)"
                      strokeWidth="6"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="font-mono text-4xl font-black text-white-soft">0</div>
                      <div className="font-accent mt-1 text-xs font-medium uppercase tracking-widest text-crimson">
                        {t("common.points")}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-8">
                {[
                  { value: "0", label: t("common.streak"), icon: "M13 10V3L4 14h7v7l9-11h-7z" },
                  {
                    value: "0h",
                    label: t("common.focus"),
                    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                  },
                ].map((stat) => (
                  <div key={stat.label} className="group text-center">
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface-glass text-gray-muted shadow-lg">
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
                    <div className="font-mono text-xs font-medium text-gray-muted">
                      {stat.value} {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col justify-center">
            <h3 className="font-accent mb-4 px-2 text-lg font-bold tracking-widest text-white-soft">
              {t("dashboard.communiqué")}
            </h3>
            <EmptyState message={t("dashboard.noAnnouncements")} />
          </motion.div>
        </div>

        <motion.div variants={itemVariants}>
          <KatanaDivider />
        </motion.div>

        <motion.div variants={itemVariants}>
          <EmptyState message={t("dashboard.noFeed")} />
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="xl:col-span-1">
        <Card className="h-full border-border/50 p-6">
          <h3 className="font-accent mb-6 text-sm font-bold uppercase tracking-widest text-gray-muted">
            {t("dashboard.activeSyndicate")}
          </h3>
          <EmptyState message={t("dashboard.noActiveMembers")} />
        </Card>
      </motion.div>
    </motion.div>
  );
}
