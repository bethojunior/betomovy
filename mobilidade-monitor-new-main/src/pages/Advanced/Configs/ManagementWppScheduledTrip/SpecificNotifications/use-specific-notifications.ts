import { Form, message } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import swal from "sweetalert";
import api from "../../../../../services/api";
import apiWhatsapp from "../../../../../services/apiWhatsApp";
import { getProjectWhatsAppSessionName } from "../../../../../utils/getProjectWhatsAppSessionName";
import { useFullyContext } from "../../../../../hooks/useFullyContext";
import type { GroupSelectOption, WhatsAppGroupOption } from "../management-wpp-scheduled-trip.types";
import {
  buildGroupSelectValue,
  expandNotifierGetMyGroupsError,
  extractManagementWppRows,
  extractNotifierWhatsappGroups,
  getGroupOptionLabel,
  parseGroupSelectValue,
  readAxiosErrorMessage,
  readNotifierGetMyGroupsFailureMessage,
  SCHEDULED_TRIP_REFERENCE,
} from "../management-wpp-scheduled-trip.helpers";
import { buildDefaultMessage, pickSpecificRows } from "./specific-notifications.helpers";
import type {
  SpecificNotificationBody,
  SpecificNotificationFormValues,
  SpecificNotificationRow,
  TripTypeOption,
  UseSpecificNotificationsResult,
} from "./specific-notifications.types";

const GROUPS_EMPTY_USER_MESSAGE =
  "Nenhum grupo apareceu na lista. Abra “Conectar whatsapp”, confira se a sessão está ativa e atualize a página.";

export const useSpecificNotifications = (): UseSpecificNotificationsResult => {
  const sessionName = useMemo(() => getProjectWhatsAppSessionName(), []);
  const { fullyList } = useFullyContext();
  const [form] = Form.useForm<SpecificNotificationFormValues>();

  const [rows, setRows] = useState<SpecificNotificationRow[]>([]);
  const [loadingRows, setLoadingRows] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingRow, setEditingRow] = useState<SpecificNotificationRow | null>(null);

  const [groupOptions, setGroupOptions] = useState<WhatsAppGroupOption[]>([]);
  const [groupsLoadError, setGroupsLoadError] = useState<string | null>(null);
  const [groupsEmptyHint, setGroupsEmptyHint] = useState<string | null>(null);

  const [tripTypeOptions, setTripTypeOptions] = useState<TripTypeOption[]>([]);

  const groupSelectOptions = useMemo((): GroupSelectOption[] => {
    return [...groupOptions]
      .sort((a, b) => getGroupOptionLabel(a).localeCompare(getGroupOptionLabel(b), "pt-BR", { sensitivity: "base" }))
      .map((g) => ({ value: buildGroupSelectValue(g), label: getGroupOptionLabel(g) }));
  }, [groupOptions]);

  const cityOptions = useMemo(() => {
    return [...fullyList]
      .map((c) => ({ cityId: c.cityId, nome: c.nome }))
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" }));
  }, [fullyList]);

  const loadRows = useCallback(async (): Promise<void> => {
    setLoadingRows(true);
    try {
      const res = await api.get("managementWppNotifications", { params: { reference: SCHEDULED_TRIP_REFERENCE } });
      setRows(pickSpecificRows(extractManagementWppRows<SpecificNotificationRow>(res.data)));
    } catch (err) {
      setErrorBanner(readAxiosErrorMessage(err));
    } finally {
      setLoadingRows(false);
    }
  }, []);

  const loadGroups = useCallback(async (): Promise<void> => {
    setGroupsLoadError(null);
    setGroupsEmptyHint(null);
    try {
      const res = await apiWhatsapp.get("/get-my-groups", { params: { sessionName } });
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

  const loadTripTypes = useCallback(async (): Promise<void> => {
    try {
      const res = await api.get("tripType");
      const list = res.data?.response;
      setTripTypeOptions(Array.isArray(list) ? list : []);
    } catch (err) {
      setTripTypeOptions([]);
    }
  }, []);

  useEffect(() => {
    void loadRows();
    void loadGroups();
    void loadTripTypes();
  }, [loadRows, loadGroups, loadTripTypes]);

  const openCreateModal = useCallback((): void => {
    setEditingRow(null);
    form.resetFields();
    form.setFieldsValue({ status: true });
    setModalOpen(true);
  }, [form]);

  const openEditModal = useCallback(
    (row: SpecificNotificationRow): void => {
      setEditingRow(row);
      form.setFieldsValue({
        groupSelectValue: buildGroupSelectValue({ groupId: row.group_id, groupName: row.group_name }),
        cityId: row.cityId ?? undefined,
        tripTypeId: row.tripTypeId ?? undefined,
        status: Boolean(row.status),
        message: row.message,
      });
      setModalOpen(true);
    },
    [form],
  );

  const closeModal = useCallback((): void => {
    setModalOpen(false);
    setEditingRow(null);
    form.resetFields();
  }, [form]);

  const regenerateMessage = useCallback(
    (overrides: { cityId?: number | null; tripTypeId?: number | null }): void => {
      const current = form.getFieldsValue();
      const cityId = overrides.cityId !== undefined ? overrides.cityId : current.cityId ?? null;
      const tripTypeId = overrides.tripTypeId !== undefined ? overrides.tripTypeId : current.tripTypeId ?? null;

      const cityName = cityId ? cityOptions.find((c) => c.cityId === cityId)?.nome ?? null : null;
      const tripTypeName = tripTypeId ? tripTypeOptions.find((t) => t.idTripType === tripTypeId)?.type ?? null : null;

      form.setFieldValue("message", buildDefaultMessage(cityName, tripTypeName));
    },
    [form, cityOptions, tripTypeOptions],
  );

  const handleSubmit = useCallback(
    async (values: SpecificNotificationFormValues): Promise<void> => {
      const { groupId, groupName } = parseGroupSelectValue(values.groupSelectValue);
      if (!groupId) {
        void message.warning("Selecione um grupo na lista.");
        return;
      }

      if (values.cityId == null && values.tripTypeId == null) {
        void message.warning("Selecione pelo menos uma cidade ou um tipo de chamado.");
        return;
      }

      const cityName = values.cityId
        ? cityOptions.find((c) => c.cityId === values.cityId)?.nome ?? null
        : null;
      const tripTypeName = values.tripTypeId
        ? tripTypeOptions.find((t) => t.idTripType === values.tripTypeId)?.type ?? null
        : null;

      const body: SpecificNotificationBody = {
        group_id: groupId,
        group_name: groupName,
        reference: SCHEDULED_TRIP_REFERENCE,
        cityId: values.cityId ?? null,
        tripTypeId: values.tripTypeId ?? null,
        status: Boolean(values.status),
        message: values.message?.trim() || editingRow?.message || buildDefaultMessage(cityName, tripTypeName),
      };

      setSaving(true);
      setErrorBanner(null);
      try {
        if (editingRow) {
          await api.put(`managementWppNotifications/${editingRow.id}`, body);
        } else {
          await api.post("managementWppNotifications", body);
        }
        await loadRows();
        closeModal();
        void message.success("Alterações salvas com sucesso.");
      } catch (err) {
        setErrorBanner(readAxiosErrorMessage(err));
      } finally {
        setSaving(false);
      }
    },
    [cityOptions, tripTypeOptions, editingRow, loadRows, closeModal],
  );

  const handleDelete = useCallback(
    async (row: SpecificNotificationRow): Promise<void> => {
      const confirmed = await swal({
        title: "Excluir notificação?",
        text: "Essa configuração de notificação específica será removida permanentemente.",
        icon: "warning",
        buttons: ["Cancelar", "Confirmar"],
        dangerMode: true,
      });
      if (!confirmed) {
        return;
      }

      setDeletingId(row.id);
      setErrorBanner(null);
      try {
        await api.delete(`managementWppNotifications/${row.id}`);
        await loadRows();
        void message.success("Notificação excluída com sucesso.");
      } catch (err) {
        setErrorBanner(readAxiosErrorMessage(err));
      } finally {
        setDeletingId(null);
      }
    },
    [loadRows],
  );

  const dismissErrorBanner = useCallback(() => setErrorBanner(null), []);
  const dismissGroupsLoadError = useCallback(() => setGroupsLoadError(null), []);
  const dismissGroupsEmptyHint = useCallback(() => setGroupsEmptyHint(null), []);

  return {
    form,
    rows,
    loadingRows,
    saving,
    deletingId,
    errorBanner,
    modalOpen,
    editingRow,
    groupSelectOptions,
    groupOptionsCount: groupOptions.length,
    groupsLoadError,
    groupsEmptyHint,
    tripTypeOptions,
    cityOptions,
    openCreateModal,
    openEditModal,
    closeModal,
    regenerateMessage,
    handleSubmit,
    handleDelete,
    dismissErrorBanner,
    dismissGroupsLoadError,
    dismissGroupsEmptyHint,
  };
};
