import axios from "axios";
import type { DefaultOptionType } from "antd/es/select";
import type {
  ManagementWppNotificationPutBody,
  ManagementWppNotificationPutInput,
  ManagementWppNotificationRow,
  WhatsAppGroupOption,
} from "./management-wpp-scheduled-trip.types";

export const SCHEDULED_TRIP_REFERENCE = "scheduled_trip_notification";

export const buildManagementWppNotificationPutBody = (
  input: ManagementWppNotificationPutInput,
): ManagementWppNotificationPutBody => ({
  group_id: input.groupId,
  group_name: input.groupName,
  status: input.status,
});

export const extractManagementWppRows = <T = ManagementWppNotificationRow>(payload: unknown): T[] => {
  if (!payload || typeof payload !== "object") {
    return [];
  }
  const body = payload as { response?: unknown };
  if (!Array.isArray(body.response)) {
    return [];
  }
  return body.response as T[];
};

export const pickActiveManagementRow = (rows: ManagementWppNotificationRow[]): ManagementWppNotificationRow | null => {
  return (
    rows.find((r) => r.reference === SCHEDULED_TRIP_REFERENCE && r.cityId == null && r.tripTypeId == null) ?? null
  );
};

export const buildManagementConfigTitle = (row: ManagementWppNotificationRow | null): string => {
  if (!row) {
    return "";
  }
  const msg = row.message.trim();
  if (msg.length > 0) {
    return msg.length > 120 ? `${msg.slice(0, 117)}…` : msg;
  }
  const ref = row.reference.trim();
  if (ref.length > 0) {
    return ref;
  }
  return `Configuração #${row.id}`;
};

const deserializeNotifierPayload = (data: unknown): unknown => {
  if (typeof data === "string") {
    const trimmed = data.trim();
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try {
        return JSON.parse(trimmed) as unknown;
      } catch {
        return data;
      }
    }
    return data;
  }
  return data;
};

const pickRawGroupId = (g: Record<string, unknown>): string => {
  const stringKeys: unknown[] = [
    g.jid,
    g.remoteJid,
    g.remote,
    g.chatId,
    g.group_id,
    g.groupId,
    g.groupJid,
  ];
  for (const c of stringKeys) {
    if (typeof c === "string" && c.trim().length > 0) {
      return c.trim();
    }
  }
  const idVal = g.id;
  if (typeof idVal === "string" && idVal.trim().length > 0) {
    return idVal.trim();
  }
  if (idVal && typeof idVal === "object") {
    const o = idVal as Record<string, unknown>;
    const ser = o._serialized;
    if (typeof ser === "string" && ser.includes("@")) {
      return ser.trim();
    }
    const user = o.user;
    const server = o.server;
    if (typeof user === "string" && typeof server === "string") {
      return `${user}@${server}`.trim();
    }
  }
  return "";
};

const pickRawGroupName = (g: Record<string, unknown>): string =>
  String(g.name ?? g.subject ?? g.notify ?? g.pushName ?? g.group_name ?? g.groupName ?? "").trim();

const isLikelyGroupRow = (x: unknown): boolean => {
  if (!x || typeof x !== "object") {
    return false;
  }
  const id = pickRawGroupId(x as Record<string, unknown>);
  if (id.length === 0) {
    return false;
  }
  return id.includes("@") || id.length >= 12;
};

const tryParseJsonArray = (raw: unknown): unknown[] | null => {
  if (typeof raw !== "string") {
    return null;
  }
  const t = raw.trim();
  if (!t.startsWith("[") || !t.endsWith("]")) {
    return null;
  }
  try {
    const parsed: unknown = JSON.parse(t) as unknown;
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

const collectGroupRows = (payload: unknown): unknown[] => {
  const root = deserializeNotifierPayload(payload);
  if (Array.isArray(root)) {
    if (root.length > 0 && root.every((x) => Array.isArray(x))) {
      return (root as unknown[][]).flat();
    }
    return root;
  }
  if (!root || typeof root !== "object") {
    return [];
  }
  const o = root as Record<string, unknown>;
  const notifierSuccess = o.success;
  if (
    Array.isArray(notifierSuccess) &&
    notifierSuccess.length > 0 &&
    notifierSuccess.some((row) => isLikelyGroupRow(row))
  ) {
    return notifierSuccess;
  }
  const directKeys = ["response", "data", "groups", "chats", "result", "items", "payload", "rows", "list", "body"];
  for (const k of directKeys) {
    const v = o[k];
    const parsedArr = tryParseJsonArray(v);
    const candidate = Array.isArray(v) ? v : parsedArr;
    if (
      Array.isArray(candidate) &&
      candidate.length > 0 &&
      candidate.some((row) => isLikelyGroupRow(row))
    ) {
      return candidate;
    }
  }
  const nested = o.data;
  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    const d = nested as Record<string, unknown>;
    for (const k of directKeys) {
      const v = d[k];
      const parsedArr = tryParseJsonArray(v);
      const candidate = Array.isArray(v) ? v : parsedArr;
      if (
        Array.isArray(candidate) &&
        candidate.length > 0 &&
        candidate.some((row) => isLikelyGroupRow(row))
      ) {
        return candidate;
      }
    }
  }
  const queue: unknown[] = [o];
  const seen = new Set<object>();
  while (queue.length > 0) {
    const cur = queue.shift();
    if (!cur || typeof cur !== "object" || Array.isArray(cur)) {
      continue;
    }
    const obj = cur as object;
    if (seen.has(obj)) {
      continue;
    }
    seen.add(obj);
    for (const v of Object.values(cur as Record<string, unknown>)) {
      const parsedArr = tryParseJsonArray(v);
      const candidate = Array.isArray(v) ? v : parsedArr;
      if (
        Array.isArray(candidate) &&
        candidate.length > 0 &&
        candidate.some((row) => isLikelyGroupRow(row))
      ) {
        return candidate;
      }
      if (v && typeof v === "object" && !Array.isArray(v)) {
        queue.push(v);
      }
    }
  }
  return [];
};

export const extractNotifierWhatsappGroups = (payload: unknown): WhatsAppGroupOption[] => {
  const raw = collectGroupRows(payload);
  return raw
    .map((item: unknown) => {
      if (!item || typeof item !== "object") {
        return null;
      }
      const g = item as Record<string, unknown>;
      const groupId = pickRawGroupId(g);
      if (!groupId) {
        return null;
      }
      const groupName = pickRawGroupName(g);
      return { groupId, groupName } as WhatsAppGroupOption;
    })
    .filter((x): x is WhatsAppGroupOption => x !== null);
};

const pickPayloadString = (v: unknown): string | null => {
  if (typeof v === "string" && v.trim() !== "") {
    return v.trim();
  }
  return null;
};

const formatApiResponseArrayFirstEntry = (first: unknown): string => {
  const direct = pickPayloadString(first);
  if (direct) {
    return direct;
  }
  if (first != null && typeof first === "object" && !Array.isArray(first)) {
    const o = first as { message?: unknown; error?: unknown };
    const nested = pickPayloadString(o.message) ?? pickPayloadString(o.error);
    if (nested) {
      return nested;
    }
    try {
      return JSON.stringify(first);
    } catch {
      return "Resposta inválida da API.";
    }
  }
  if (typeof first === "number" || typeof first === "boolean") {
    return String(first);
  }
  return "Resposta inválida da API.";
};

export const readNotifierGetMyGroupsFailureMessage = (payload: unknown): string | null => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }
  const o = payload as { success?: unknown; message?: unknown };
  if (o.success === false) {
    return pickPayloadString(o.message) ?? "Falha ao obter grupos no notifier.";
  }
  return null;
};

export const readAxiosErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const raw = error.response?.data;
    if (raw != null && typeof raw === "object") {
      const data = raw as { message?: unknown; error?: unknown; response?: unknown };
      const msg = pickPayloadString(data.message) ?? pickPayloadString(data.error);
      if (msg) {
        return msg;
      }
      if (Array.isArray(data.response) && data.response.length > 0) {
        return formatApiResponseArrayFirstEntry(data.response[0]);
      }
    }
    return error.message;
  }
  return "Não foi possível concluir a operação. Tente de novo.";
};

export const expandNotifierGetMyGroupsError = (message: string): string => {
  if (/falha ao enviar/i.test(message)) {
    return `${message}. No notifier costuma indicar sessão sem cliente ligado ou falha interna. Confira se a sessão está conectada em “Conectar whatsapp”.`;
  }
  return message;
};

export const buildGroupSelectValue = (g: WhatsAppGroupOption): string => `${g.groupId}::${g.groupName}`;

export const getGroupOptionLabel = (g: WhatsAppGroupOption): string => {
  const n = g.groupName.trim();
  if (n.length > 0) {
    return n;
  }
  return g.groupId;
};

export const parseGroupSelectValue = (raw: string): { groupId: string; groupName: string } => {
  const sep = raw.indexOf("::");
  if (sep < 0) {
    return { groupId: raw, groupName: "" };
  }
  return {
    groupId: raw.slice(0, sep),
    groupName: raw.slice(sep + 2),
  };
};

export const resolveWhatsappGroupPreview = (
  listPick: string | null,
  row: ManagementWppNotificationRow | null,
): { readonly groupId: string; readonly groupName: string } => {
  if (listPick !== null && listPick !== "") {
    return parseGroupSelectValue(listPick);
  }
  return {
    groupId: (row?.group_id ?? "").trim(),
    groupName: (row?.group_name ?? "").trim(),
  };
};

export const findWhatsappSelectValueMatchingRow = (
  row: ManagementWppNotificationRow | null,
  options: readonly { readonly value: string; readonly label: string }[],
): string | undefined => {
  const gid = row?.group_id?.trim();
  if (!gid) {
    return undefined;
  }
  const opt = options.find((o) => parseGroupSelectValue(String(o.value)).groupId.trim() === gid);
  return opt?.value;
};

export const resolveMainWhatsappSelectValue = (
  listPick: string | null,
  row: ManagementWppNotificationRow | null,
  options: readonly { readonly value: string; readonly label: string }[],
): string | undefined => {
  if (listPick === "") {
    return undefined;
  }
  if (listPick !== null) {
    return listPick;
  }
  return findWhatsappSelectValueMatchingRow(row, options);
};

export const filterGroupSelectOption = (input: string, option: DefaultOptionType | undefined): boolean => {
  const qRaw = input == null ? "" : String(input).trim().toLowerCase();
  if (qRaw === "") {
    return true;
  }
  const label = String(option?.label ?? "").toLowerCase();
  const v = String(option?.value ?? "");
  const { groupId: id, groupName: name } = parseGroupSelectValue(v);
  return label.includes(qRaw) || name.toLowerCase().includes(qRaw) || id.toLowerCase().includes(qRaw);
};
