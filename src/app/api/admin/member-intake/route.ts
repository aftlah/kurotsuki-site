import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase";
import { isSomukanriAdministrator } from "@/lib/organization/permissions";
import { getSessionOrgProfile } from "@/lib/session";
import {
  buildKtpStoragePath,
  KTP_STORAGE_BUCKET,
  sendMemberIntakeToDiscord,
  validateKtpFile,
  validateMemberIntakeInput,
  type MemberIntakeRecord,
} from "@/lib/member-intake";

async function requireIntakeAccess() {
  const auth = await getSessionOrgProfile();
  if (!auth) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (!isSomukanriAdministrator(auth.profile)) {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { auth };
}

function mapRow(
  row: {
    id: string;
    ic_name: string;
    japanese_name: string;
    citizen_id: string;
    ic_phone: string;
    vehicle_plates: string | null;
    ktp_photo_path: string;
    submitted_by: string | null;
    discord_sent_at: string | null;
    discord_error: string | null;
    created_at: string;
  },
  submitterName: string | null
): MemberIntakeRecord {
  return {
    id: row.id,
    icName: row.ic_name,
    japaneseName: row.japanese_name,
    citizenId: row.citizen_id,
    icPhone: row.ic_phone,
    vehiclePlates: row.vehicle_plates,
    ktpPhotoPath: row.ktp_photo_path,
    submittedBy: row.submitted_by,
    submittedByName: submitterName,
    discordSentAt: row.discord_sent_at,
    discordError: row.discord_error,
    createdAt: row.created_at,
  };
}

export async function GET() {
  const guard = await requireIntakeAccess();
  if ("error" in guard && guard.error) return guard.error;

  try {
    const admin = createSupabaseAdmin();
    const { data, error } = await admin
      .from("member_intake_records")
      .select(
        "id, ic_name, japanese_name, citizen_id, ic_phone, vehicle_plates, ktp_photo_path, submitted_by, discord_sent_at, discord_error, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const submitterIds = [
      ...new Set((data ?? []).map((row) => row.submitted_by).filter(Boolean)),
    ] as string[];

    let nameMap = new Map<string, string>();
    if (submitterIds.length > 0) {
      const { data: profiles } = await admin
        .from("profiles")
        .select("id, display_name, username")
        .in("id", submitterIds);

      nameMap = new Map(
        (profiles ?? []).map((p) => [
          p.id,
          p.display_name || p.username || "Admin",
        ])
      );
    }

    const records = (data ?? []).map((row) =>
      mapRow(row, row.submitted_by ? nameMap.get(row.submitted_by) ?? null : null)
    );

    return NextResponse.json({ records });
  } catch (err) {
    console.error("Member intake GET error:", err);
    return NextResponse.json(
      { error: "Gagal memuat pendataan anggota." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const guard = await requireIntakeAccess();
  if ("error" in guard && guard.error) return guard.error;
  const { auth } = guard;

  try {
    const formData = await request.formData();
    const icName = String(formData.get("ic_name") ?? "").trim();
    const japaneseName = String(formData.get("japanese_name") ?? "").trim();
    const citizenId = String(formData.get("citizen_id") ?? "").trim();
    const icPhone = String(formData.get("ic_phone") ?? "").trim();
    const vehiclePlates = String(formData.get("vehicle_plates") ?? "").trim();
    const ktpFile = formData.get("ktp_photo");

    const input = {
      icName,
      japaneseName,
      citizenId,
      icPhone,
      vehiclePlates: vehiclePlates || null,
    };

    const validationError = validateMemberIntakeInput(input);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    if (!(ktpFile instanceof File) || ktpFile.size === 0) {
      return NextResponse.json(
        { error: "Foto KTP IC wajib diupload." },
        { status: 400 }
      );
    }

    const fileError = validateKtpFile(ktpFile);
    if (fileError) {
      return NextResponse.json({ error: fileError }, { status: 400 });
    }

    const admin = createSupabaseAdmin();
    const recordId = crypto.randomUUID();
    const storagePath = buildKtpStoragePath(recordId, ktpFile.name);
    const fileBuffer = Buffer.from(await ktpFile.arrayBuffer());

    const { error: uploadError } = await admin.storage
      .from(KTP_STORAGE_BUCKET)
      .upload(storagePath, fileBuffer, {
        contentType: ktpFile.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: uploadError.message || "Gagal upload foto KTP." },
        { status: 500 }
      );
    }

    const { data: row, error: insertError } = await admin
      .from("member_intake_records")
      .insert({
        id: recordId,
        ic_name: icName,
        japanese_name: japaneseName,
        citizen_id: citizenId,
        ic_phone: icPhone,
        vehicle_plates: vehiclePlates || null,
        ktp_photo_path: storagePath,
        submitted_by: auth!.session.user.id,
      })
      .select(
        "id, ic_name, japanese_name, citizen_id, ic_phone, vehicle_plates, ktp_photo_path, submitted_by, discord_sent_at, discord_error, created_at"
      )
      .single();

    if (insertError || !row) {
      await admin.storage.from(KTP_STORAGE_BUCKET).remove([storagePath]);
      return NextResponse.json(
        { error: insertError?.message ?? "Gagal menyimpan data." },
        { status: 500 }
      );
    }

    const submitterName =
      auth!.session.user.name ?? auth!.session.user.email ?? "Admin";

    const discord = await sendMemberIntakeToDiscord({
      ...input,
      recordId,
      submittedByName: submitterName,
      ktpFile: {
        buffer: fileBuffer,
        filename: ktpFile.name || "ktp.jpg",
        contentType: ktpFile.type,
      },
    });

    await admin
      .from("member_intake_records")
      .update({
        discord_sent_at: discord.ok ? new Date().toISOString() : null,
        discord_error: discord.error,
      })
      .eq("id", recordId);

    const record = mapRow(
      {
        ...row,
        discord_sent_at: discord.ok ? new Date().toISOString() : null,
        discord_error: discord.error,
      },
      submitterName
    );

    if (!discord.ok) {
      return NextResponse.json(
        {
          record,
          warning:
            discord.error ??
            "Data tersimpan, tetapi gagal dikirim ke Discord.",
        },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        record,
        message: "Pendataan berhasil dan dikirim ke Discord.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Member intake POST error:", err);
    return NextResponse.json(
      { error: "Gagal memproses pendataan anggota." },
      { status: 500 }
    );
  }
}
