"use client";

import { MemberIntakeForm } from "@/components/MemberIntakeForm";
import { useTranslation } from "@/i18n/provider";

export default function AdministratorPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white-soft">
          {t("administrator.title")}
        </h2>
        <p className="mt-1 text-sm text-gray-muted">
          {t("administrator.subtitle")}
        </p>
      </div>

      <MemberIntakeForm />
    </div>
  );
}
