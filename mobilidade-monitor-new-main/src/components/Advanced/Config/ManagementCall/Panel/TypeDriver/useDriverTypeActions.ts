import { useMemo, useState } from "react";
import swal from "sweetalert";
import api from "../../../../../../services/api";
import {
  DELETE_AFTER_MOVE_ERROR_MESSAGE,
  DELETE_CONFIRM_TEXT,
  DELETE_CONFIRM_TITLE,
  DELETE_ERROR_MESSAGE,
  DELETE_SUCCESS_MESSAGE,
  LINKED_USERS_API_MESSAGE,
  LINKED_USERS_CONFIRM_TEXT,
  LINKED_USERS_CONFIRM_TITLE,
  MOVE_USERS_ERROR_MESSAGE,
  MOVE_USERS_GENERIC_ERROR_MESSAGE,
  NOT_FOUND_DRIVER_TYPE_TRANSFER_MESSAGE,
  TRANSFER_AND_DELETE_SUCCESS_MESSAGE,
  TRANSFER_SELECT_MESSAGE,
} from "./constants";
import { Driver, IDeleteDriverTypeResponse } from "./types";

type AlertType = "success" | "info" | "warning" | "error";

interface UseDriverTypeActionsParams {
  driver: Driver[];
  setLoading: (isLoading: boolean) => void;
  showFeedback: (message: string, alertType: AlertType) => void;
  reloadData: () => void;
}

interface UseDriverTypeActionsResult {
  showTransferDriversModal: boolean;
  driverTypeTransferId: number | null;
  setDriverTypeTransferId: (driverTypeId: number | null) => void;
  availableDriverTypes: Driver[];
  deleteTypeDriver: (id: number) => void;
  moveUsersAndDeleteTypeDriver: () => void;
  resetTransferState: () => void;
}

const hasLinkedUsersOnDriverType = (deleteResponse: IDeleteDriverTypeResponse): boolean => {
  const linkedUsersToken = "Existem usuários vinculados";
  const hasLinkedUsersInMessage = deleteResponse?.message?.includes(linkedUsersToken) ?? false;
  const hasLinkedUsersInResponse = Array.isArray(deleteResponse?.response)
    ? deleteResponse.response.some((message) => message.includes(linkedUsersToken))
    : false;

  return (
    deleteResponse?.message === LINKED_USERS_API_MESSAGE ||
    (deleteResponse?.response?.includes(LINKED_USERS_API_MESSAGE) ?? false) ||
    hasLinkedUsersInMessage ||
    hasLinkedUsersInResponse
  );
};

export const useDriverTypeActions = ({
  driver,
  setLoading,
  showFeedback,
  reloadData,
}: UseDriverTypeActionsParams): UseDriverTypeActionsResult => {
  const [showTransferDriversModal, setShowTransferDriversModal] = useState<boolean>(false);
  const [driverTypeToDelete, setDriverTypeToDelete] = useState<Driver | null>(null);
  const [driverTypeTransferId, setDriverTypeTransferId] = useState<number | null>(null);

  const resetTransferState = (): void => {
    setShowTransferDriversModal(false);
    setDriverTypeToDelete(null);
    setDriverTypeTransferId(null);
  };

  const openTransferModalByDriverTypeId = (driverTypeId: number): void => {
    const selectedDriverType = driver.find((item) => item.idUserType === driverTypeId);
    if (!selectedDriverType) {
      showFeedback(NOT_FOUND_DRIVER_TYPE_TRANSFER_MESSAGE, "error");
      return;
    }
    setDriverTypeToDelete(selectedDriverType);
    setDriverTypeTransferId(null);
    setShowTransferDriversModal(true);
  };

  const askToMoveLinkedUsers = async (driverTypeId: number): Promise<boolean> => {
    const shouldMoveUsers = await swal({
      title: LINKED_USERS_CONFIRM_TITLE,
      text: LINKED_USERS_CONFIRM_TEXT,
      icon: "warning",
      buttons: ["NÃO!", "SIM!"],
    });
    if (!shouldMoveUsers) return false;
    openTransferModalByDriverTypeId(driverTypeId);
    return true;
  };

  const deleteTypeDriver = (id: number): void => {
    swal({
      title: DELETE_CONFIRM_TITLE,
      text: DELETE_CONFIRM_TEXT,
      dangerMode: true,
      icon: "warning",
      buttons: ["Cancelar", "Confirmar"],
    }).then(async (answer) => {
      if (!answer) return;
      setLoading(true);
      api
        .delete(`userType/${id}`)
        .then(async (result) => {
          setLoading(false);
          if (!result.data.status) {
            if (hasLinkedUsersOnDriverType(result.data)) {
              await askToMoveLinkedUsers(id);
              return;
            }
            showFeedback(DELETE_ERROR_MESSAGE, "error");
            return;
          }
          showFeedback(DELETE_SUCCESS_MESSAGE, "success");
          reloadData();
        })
        .catch(async (error: unknown) => {
          setLoading(false);
          const errorResponse = (error as { response?: { data?: IDeleteDriverTypeResponse } })
            ?.response?.data;
          if (errorResponse && hasLinkedUsersOnDriverType(errorResponse)) {
            await askToMoveLinkedUsers(id);
            return;
          }
          showFeedback(DELETE_ERROR_MESSAGE, "error");
        });
    });
  };

  const moveUsersAndDeleteTypeDriver = (): void => {
    if (!driverTypeToDelete) {
      resetTransferState();
      return;
    }
    if (driverTypeTransferId === null) {
      showFeedback(TRANSFER_SELECT_MESSAGE, "warning");
      return;
    }
    setLoading(true);
    api
      .put(`userType/${driverTypeToDelete.idUserType}/moveUsers/${driverTypeTransferId}`)
      .then((moveUsersResult) => {
        if (!moveUsersResult.data.status) {
          setLoading(false);
          showFeedback(MOVE_USERS_ERROR_MESSAGE, "error");
          return;
        }
        return api.delete(`userType/${driverTypeToDelete.idUserType}`).then((result) => {
          setLoading(false);
          if (!result.data.status) {
            showFeedback(DELETE_AFTER_MOVE_ERROR_MESSAGE, "error");
            return;
          }
          resetTransferState();
          showFeedback(TRANSFER_AND_DELETE_SUCCESS_MESSAGE, "success");
          reloadData();
        });
      })
      .catch(() => {
        setLoading(false);
        showFeedback(MOVE_USERS_GENERIC_ERROR_MESSAGE, "error");
      });
  };

  const availableDriverTypes = useMemo((): Driver[] => {
    if (!driverTypeToDelete) return [];
    return driver.filter((item) => item.idUserType !== driverTypeToDelete.idUserType);
  }, [driver, driverTypeToDelete]);

  return {
    showTransferDriversModal,
    driverTypeTransferId,
    setDriverTypeTransferId,
    availableDriverTypes,
    deleteTypeDriver,
    moveUsersAndDeleteTypeDriver,
    resetTransferState,
  };
};
