import { Form, message } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../../../services/api";
import apiWhatsapp from "../../../../services/apiWhatsApp";
import { getProjectWhatsAppSessionName } from "../../../../utils/getProjectWhatsAppSessionName";
import type {
  GroupSelectOption,
  ManagementWppNotificationRow,
  ManagementWppScheduledTripFormValues,
  UseManagementWppScheduledTripResult,
  WhatsAppGroupOption,
  WhatsappGroupPreview,
} from "./management-wpp-scheduled-trip.types";
import {
  buildGroupSelectValue,
  buildManagementWppNotificationPutBody,
  expandNotifierGetMyGroupsError,
  extractManagementWppRows,
  extractNotifierWhatsappGroups,
  getGroupOptionLabel,
  parseGroupSelectValue,
  pickActiveManagementRow,
  readAxiosErrorMessage,
  readNotifierGetMyGroupsFailureMessage,
  resolveMainWhatsappSelectValue,
  resolveWhatsappGroupPreview,
  SCHEDULED_TRIP_REFERENCE,
} from "./management-wpp-scheduled-trip.helpers";

const GROUPS_EMPTY_USER_MESSAGE =
  "Nenhum grupo apareceu na lista. Abra “Conectar whatsapp”, confira se a sessão está ativa e atualize a página.";

const EMPTY_PREVIEW: WhatsappGroupPreview = { groupId: "", groupName: "" };

export const useManagementWppScheduledTrip = (): UseManagementWppScheduledTripResult => {
  const sessionName = useMemo(() => getProjectWhatsAppSessionName(), []);
  const [form] = Form.useForm<ManagementWppScheduledTripFormValues>();
  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [groupOptions, setGroupOptions] = useState<WhatsAppGroupOption[]>([]);
  const [activeRow, setActiveRow] = useState<ManagementWppNotificationRow | null>(null);
  const [whatsappListPick, setWhatsappListPick] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [groupsLoadError, setGroupsLoadError] = useState<string | null>(null);
  const [groupsEmptyHint, setGroupsEmptyHint] = useState<string | null>(null);

  const sortedGroups = useMemo(() => {
    return [...groupOptions].sort((a, b) =>
      getGroupOptionLabel(a).localeCompare(getGroupOptionLabel(b), "pt-BR", { sensitivity: "base" }),
    );
  }, [groupOptions]);

  const selectOptions = useMemo((): GroupSelectOption[] => {
    const rowGid: string = activeRow?.group_id?.trim() ?? "";
    const rowNameSaved: string = (activeRow?.group_name ?? "").trim();
    const base: GroupSelectOption[] = sortedGroups.map((g) => {
      const gid: string = g.groupId.trim();
      const useSavedName: boolean = rowGid !== "" && gid === rowGid && rowNameSaved !== "";
      const label: string = useSavedName ? rowNameSaved : getGroupOptionLabel(g);
      return {
        value: buildGroupSelectValue(g),
        label,
      };
    });
    if (rowGid === "") {
      return base;
    }
    const hasRowInList: boolean = base.some(
      (o) => parseGroupSelectValue(String(o.value)).groupId.trim() === rowGid,
    );
    if (hasRowInList) {
      return base;
    }
    const fallback: WhatsAppGroupOption = {
      groupId: rowGid,
      groupName: (activeRow?.group_name ?? "").trim(),
    };
    return [
      { value: buildGroupSelectValue(fallback), label: getGroupOptionLabel(fallback) },
      ...base,
    ];
  }, [sortedGroups, activeRow]);

  const groupPreview = useMemo((): WhatsappGroupPreview => {
    if (!activeRow) {
      return EMPTY_PREVIEW;
    }
    return resolveWhatsappGroupPreview(whatsappListPick, activeRow);
  }, [activeRow, whatsappListPick]);

  const whatsappMainSelectValue = useMemo((): string | undefined => {
    return resolveMainWhatsappSelectValue(whatsappListPick, activeRow, selectOptions);
  }, [whatsappListPick, activeRow, selectOptions]);

  const onWhatsappMainSelectChange = useCallback((value: string | null | undefined): void => {
    if (value == null || value === "") {
      setWhatsappListPick("");
      return;
    }
    setWhatsappListPick(String(value));
  }, []);

  const loadManagementRows = useCallback(async (): Promise<void> => {
    const res = await api.get("managementWppNotifications", { params: { reference: SCHEDULED_TRIP_REFERENCE } });
    const list = extractManagementWppRows(res.data);
    setActiveRow(pickActiveManagementRow(list));
  }, []);

  useEffect(() => {
    const row = activeRow;
    if (!row) {
      form.resetFields();
      return;
    }
    form.setFieldsValue({
      status: Boolean(row.status),
    });
  }, [activeRow, form]);

  const loadWhatsAppGroups = useCallback(async (): Promise<void> => {
    setGroupsLoadError(null);
    setGroupsEmptyHint(null);
    try {
      const res = await apiWhatsapp.get("/get-my-groups", {
        params: { sessionName },
      });
      const notifierFailure = readNotifierGetMyGroupsFailureMessage(res.data);
      if (notifierFailure != null) {
        setGroupOptions([]);
        setGroupsLoadError(expandNotifierGetMyGroupsError(notifierFailure));
        return;
      }
      const list = extractNotifierWhatsappGroups(res.data);
      setGroupOptions(list);
      if (list.length === 0) {
        setGroupsEmptyHint(GROUPS_EMPTY_USER_MESSAGE);
      }
    } catch (err) {
      setGroupOptions([]);
      setGroupsLoadError(expandNotifierGetMyGroupsError(readAxiosErrorMessage(err)));
    }
  }, [sessionName]);

  const loadAll = useCallback(async (): Promise<void> => {
    setErrorBanner(null);
    setGroupsLoadError(null);
    setGroupsEmptyHint(null);
    setLoadingPage(true);
    try {
      try {
        await loadManagementRows();
      } catch (err) {
        setErrorBanner(readAxiosErrorMessage(err));
      }
      await loadWhatsAppGroups();
    } finally {
      setLoadingPage(false);
    }
  }, [loadManagementRows, loadWhatsAppGroups]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const handleSubmit = useCallback(
    async (values: ManagementWppScheduledTripFormValues): Promise<void> => {
      const row = activeRow;
      if (!row) {
        return;
      }
      const gid = groupPreview.groupId.trim();
      if (!gid) {
        void message.warning("Selecione um grupo na lista.");
        return;
      }
      setSaving(true);
      setErrorBanner(null);
      try {
        const putBody = buildManagementWppNotificationPutBody({
          groupId: gid,
          groupName: groupPreview.groupName.trim(),
          status: Boolean(values.status),
        });
        await api.put(`managementWppNotifications/${row.id}`, putBody);
        await loadManagementRows();
        await loadWhatsAppGroups();
        setWhatsappListPick(null);
        void message.success("Alterações salvas com sucesso.");
      } catch (err) {
        setErrorBanner(readAxiosErrorMessage(err));
      } finally {
        setSaving(false);
      }
    },
    [activeRow, groupPreview.groupId, groupPreview.groupName, loadManagementRows, loadWhatsAppGroups],
  );

  const dismissErrorBanner = useCallback(() => setErrorBanner(null), []);
  const dismissGroupsLoadError = useCallback(() => setGroupsLoadError(null), []);
  const dismissGroupsEmptyHint = useCallback(() => setGroupsEmptyHint(null), []);

  return {
    form,
    loadingPage,
    saving,
    activeRow,
    whatsappMainSelectValue,
    onWhatsappMainSelectChange,
    errorBanner,
    groupsLoadError,
    groupsEmptyHint,
    selectOptions,
    groupOptionsCount: groupOptions.length,
    handleSubmit,
    dismissErrorBanner,
    dismissGroupsLoadError,
    dismissGroupsEmptyHint,
  };
};
