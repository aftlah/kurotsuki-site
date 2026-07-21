"use client";

import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Badge } from "@/components/Badge";
import { EmptyState } from "@/components/EmptyState";
import { useToast } from "@/components/Toast";
import { useTranslation } from "@/i18n/provider";
import type { MemberIntakeRecord } from "@/lib/member-intake";

export function MemberIntakeForm() {
  const { t } = useTranslation();
  const { success, error: toastError, info } = useToast();

  const [icName, setIcName] = useState("");
  const [japaneseName, setJapaneseName] = useState("");
  const [citizenId, setCitizenId] = useState("");
  const [icPhone, setIcPhone] = useState("");
  const [vehiclePlates, setVehiclePlates] = useState("");
  const [ktpPhoto, setKtpPhoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [records, setRecords] = useState<MemberIntakeRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(true);

  const loadRecords = useCallback(async () => {
    setLoadingRecords(true);
    try {
      const res = await fetch("/api/admin/member-intake");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? t("intake.loadFailed"));
      setRecords(data.records ?? []);
    } catch (err) {
      toastError(
        err instanceof Error ? err.message : t("intake.loadFailed")
      );
    } finally {
      setLoadingRecords(false);
    }
  }, [t, toastError]);

  useEffect(() => {
    void loadRecords();
  }, [loadRecords]);

  const resetForm = () => {
    setIcName("");
    setJapaneseName("");
    setCitizenId("");
    setIcPhone("");
    setVehiclePlates("");
    setKtpPhoto(null);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!ktpPhoto) {
      toastError(t("intake.ktpRequired"));
      return;
    }

    setSubmitting(true);
    try {
      const body = new FormData();
      body.append("ic_name", icName.trim());
      body.append("japanese_name", japaneseName.trim());
      body.append("citizen_id", citizenId.trim());
      body.append("ic_phone", icPhone.trim());
      body.append("vehicle_plates", vehiclePlates.trim());
      body.append("ktp_photo", ktpPhoto);

      const res = await fetch("/api/admin/member-intake", {
        method: "POST",
        body,
      });
      const data = await res.json();

      if (!res.ok && res.status !== 201) {
        throw new Error(data.error ?? t("intake.submitFailed"));
      }

      if (data.warning) {
        info(data.warning);
      } else {
        success(data.message ?? t("intake.submitSuccess"));
      }

      resetForm();
      await loadRecords();
    } catch (err) {
      toastError(
        err instanceof Error ? err.message : t("intake.submitFailed")
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6" variant="premium">
        <h3 className="mb-1 text-lg font-semibold text-white-soft">
          {t("intake.title")}
        </h3>
        <p className="mb-6 text-sm text-gray-muted">{t("intake.subtitle")}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label={t("intake.icName")}
              value={icName}
              onChange={(e) => setIcName(e.target.value)}
              placeholder={t("intake.icNamePlaceholder")}
              required
              disabled={submitting}
            />
            <Input
              label={t("intake.japaneseName")}
              value={japaneseName}
              onChange={(e) => setJapaneseName(e.target.value)}
              placeholder={t("intake.japaneseNamePlaceholder")}
              required
              disabled={submitting}
            />
            <Input
              label={t("intake.citizenId")}
              value={citizenId}
              onChange={(e) => setCitizenId(e.target.value)}
              placeholder="123456"
              required
              disabled={submitting}
            />
            <Input
              label={t("intake.icPhone")}
              value={icPhone}
              onChange={(e) => setIcPhone(e.target.value)}
              placeholder="555-0123"
              required
              disabled={submitting}
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-muted">
              {t("intake.vehiclePlates")}
            </label>
            <textarea
              value={vehiclePlates}
              onChange={(e) => setVehiclePlates(e.target.value)}
              placeholder={t("intake.vehiclePlatesPlaceholder")}
              disabled={submitting}
              rows={2}
              className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-3 text-sm text-white-soft placeholder-gray-muted transition-colors focus:border-crimson focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-muted">
              {t("intake.vehiclePlatesHint")}
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-muted">
              {t("intake.ktpPhoto")} *
            </label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              disabled={submitting}
              onChange={(e) => setKtpPhoto(e.target.files?.[0] ?? null)}
              className="w-full rounded-xl border border-border bg-bg-secondary px-4 py-3 text-sm text-gray-muted file:mr-4 file:rounded-lg file:border-0 file:bg-crimson/20 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-crimson"
            />
            <p className="mt-1 text-xs text-gray-muted">{t("intake.ktpHint")}</p>
            {ktpPhoto && (
              <p className="mt-1 text-xs text-white-soft">
                {ktpPhoto.name} ({Math.round(ktpPhoto.size / 1024)} KB)
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={submitting}
            >
              {t("common.reset")}
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? t("intake.submitting") : t("intake.submit")}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-semibold text-white-soft">
          {t("intake.recentRecords")}
        </h3>
        {loadingRecords ? (
          <p className="text-sm text-gray-muted">{t("common.loading")}</p>
        ) : records.length === 0 ? (
          <EmptyState message={t("intake.noRecords")} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-muted">
                    {t("intake.icName")}
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-muted">
                    {t("intake.japaneseName")}
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-muted">
                    {t("intake.citizenId")}
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-muted">
                    Discord
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-muted">
                    {t("intake.submittedAt")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.map((record) => (
                  <tr key={record.id} className="border-b border-border/50">
                    <td className="px-3 py-3 text-sm text-white-soft">
                      {record.icName}
                    </td>
                    <td className="px-3 py-3 text-sm text-white-soft">
                      {record.japaneseName}
                    </td>
                    <td className="px-3 py-3 font-mono text-sm text-gray-muted">
                      {record.citizenId}
                    </td>
                    <td className="px-3 py-3">
                      {record.discordSentAt ? (
                        <Badge variant="success">OK</Badge>
                      ) : (
                        <span title={record.discordError ?? ""}>
                          <Badge variant="warning">
                            {t("intake.discordFailed")}
                          </Badge>
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-muted">
                      {new Date(record.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
