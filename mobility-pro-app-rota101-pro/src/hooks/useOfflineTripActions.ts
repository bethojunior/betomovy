import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DeviceEventEmitter } from 'react-native';
import { storage } from '~/common/services/mmkv/storage';
import { useNetwork } from '~/context/ConfigGlobal';
import { isNetworkError } from '~/utils/network';
import { TripStatusService } from '~/driver/src/context/TripStatus/service';
import { isRecalcAlreadyApplied } from '~/driver/src/utils/tripUtils';
import { serviceTaximeter } from '~/driver/src/context/Taximeter/services';
import apiMainDriver from '~/driver/src/api/apiMain';
import { Trip } from '~/interfaces/trip';
import { AvaliationPayload } from '~/interfaces/avaliation';
import { TIMEOUT_LONG, TIMEOUT_SHORT } from '~/common/constants/timeouts';

export const OFFLINE_TRIP_FINISHED_EVENT = '@App:offlineTripActionCompleted';
export const OFFLINE_QUEUE_CHANGED_EVENT = '@App:offlineTripQueueChanged';
export const OFFLINE_SYNC_STATUS_EVENT = '@App:offlineSyncStatusChanged';

export const OFFLINE_QUEUE_KEY = '@App:offlineTripQueue';
export const OFFLINE_TAXIMETER_FLAG_KEY = '@App:finalizeTripNoNetwork';
export const OFFLINE_TAXIMETER_INFO_KEY = '@App:informationsTaximeter';

type OfflineActionBase = {
  id: string;
  createdAt: number;
};

export type FinishTripAction = OfflineActionBase & {
  type: 'FINISH_TRIP';
  tripReference: string;
};

export type FinishTaximeterTripAction = OfflineActionBase & {
  type: 'FINISH_TAXIMETER_TRIP';
  tripReference: string;
  km: number;
  estimatedTripTime: number;
  price: number;
};

export type FinishTripWithRecalcAction = OfflineActionBase & {
  type: 'FINISH_TRIP_WITH_RECALC';
  tripReference: string;
  oldPrice: number;
  newPrice: number;
  newDistance: number;
  newTripTime: number;
  tolls: any[];
};

export type DoorHandleManualAction = OfflineActionBase & {
  type: 'DOOR_HANDLE_MANUAL';
  payload: Record<string, any>;
};

export type SendAvaliationAction = OfflineActionBase & {
  type: 'SEND_AVALIATION';
} & AvaliationPayload;

export type OfflineAction =
  | FinishTripAction
  | FinishTaximeterTripAction
  | FinishTripWithRecalcAction
  | DoorHandleManualAction
  | SendAvaliationAction;

export type FinishOfflineAction =
  | FinishTripAction
  | FinishTaximeterTripAction
  | FinishTripWithRecalcAction;

export interface FinishTaximeterParams {
  tripReference: string;
  km: number;
  estimatedTripTime: number;
  price: number;
}

export interface FinishTripWithRecalcParams {
  tripReference: string;
  oldPrice: number;
  newPrice: number;
  newDistance: number;
  newTripTime: number;
  tolls: any[];
}

export const RETRY_INTERVAL_MS = 5000;

const FINISH_ACTION_TYPES: FinishOfflineAction['type'][] = [
  'FINISH_TRIP',
  'FINISH_TAXIMETER_TRIP',
  'FINISH_TRIP_WITH_RECALC',
];

export function isFinishOfflineAction(
  action: OfflineAction,
): action is FinishOfflineAction {
  return (FINISH_ACTION_TYPES as string[]).includes(action.type);
}

function emitQueueChanged(): void {
  DeviceEventEmitter.emit(OFFLINE_QUEUE_CHANGED_EVENT);
}

export const offlineTripQueue = {
  getAll(): OfflineAction[] {
    try {
      return (storage.getItem(OFFLINE_QUEUE_KEY, 'json') as OfflineAction[]) ?? [];
    } catch {
      return [];
    }
  },

  hasPendingFinish(tripReference: string): boolean {
    if (!tripReference) return false;

    return this.getAll().some(
      (action) => isFinishOfflineAction(action) && action.tripReference === tripReference,
    );
  },

  add(action: OfflineAction): void {
    const current = this.getAll();
    const deduped = current.filter((a) => a.id !== action.id);
    storage.setItem(OFFLINE_QUEUE_KEY, [...deduped, action], 'json');
    emitQueueChanged();
  },

  remove(id: string): void {
    const current = this.getAll();
    const remaining = current.filter((a) => a.id !== id);
    if (remaining.length === current.length) return;

    if (remaining.length === 0) {
      storage.removeItem(OFFLINE_QUEUE_KEY);
    } else {
      storage.setItem(OFFLINE_QUEUE_KEY, remaining, 'json');
    }
    emitQueueChanged();
  },

  addFinishTrip(tripReference: string): void {
    const hasRecalcPending = this.getAll().some(
      (a) => a.type === 'FINISH_TRIP_WITH_RECALC' && a.tripReference === tripReference,
    );
    if (hasRecalcPending) return;

    this.add({
      id: `finish-${tripReference}`,
      type: 'FINISH_TRIP',
      tripReference,
      createdAt: Date.now(),
    });
  },

  addFinishTaximeter(params: FinishTaximeterParams): void {
    this.add({
      id: `finish-taximeter-${params.tripReference}`,
      type: 'FINISH_TAXIMETER_TRIP',
      ...params,
      createdAt: Date.now(),
    });

    storage.setItem(OFFLINE_TAXIMETER_FLAG_KEY, true, 'boolean');
    storage.setItem(
      OFFLINE_TAXIMETER_INFO_KEY,
      {
        tripTaximeter: {
          tripReference: params.tripReference,
          estimatedTripTime: params.estimatedTripTime,
        },
        km: params.km,
        price: params.price,
      },
      'json',
    );
  },

  addFinishTripWithRecalc(params: FinishTripWithRecalcParams): void {
    this.remove(`finish-${params.tripReference}`);

    this.add({
      id: `finish-recalc-${params.tripReference}`,
      type: 'FINISH_TRIP_WITH_RECALC',
      ...params,
      createdAt: Date.now(),
    });
  },

  addDoorHandleManual(payload: Record<string, any>): void {
    this.add({
      id: `door-handle-${Date.now()}`,
      type: 'DOOR_HANDLE_MANUAL',
      payload,
      createdAt: Date.now(),
    });
  },

  addSendAvaliation(params: AvaliationPayload): void {
    this.add({
      id: `avaliation-${params.tripReference}`,
      type: 'SEND_AVALIATION',
      ...params,
      createdAt: Date.now(),
    });
  },
};

export type TripFinishStatus = 'FINISHED' | 'NOT_FINISHED' | 'UNKNOWN';

export async function getTripFinishStatus(tripReference: string): Promise<TripFinishStatus> {
  try {
    const response = await apiMainDriver.get<ApiResponse<Trip>>('Trip/Status', {
      timeout: TIMEOUT_SHORT,
      params: { tripReference },
    });
    return response?.data?.data?.status === 'finished' ? 'FINISHED' : 'NOT_FINISHED';
  } catch {
    return 'UNKNOWN';
  }
}

async function executeFinishWithReconciliation(
  tripReference: string,
  finish: () => Promise<boolean>,
): Promise<boolean> {
  try {
    if (await finish()) return true;
  } catch (error) {
    if (!isNetworkError(error)) return false;
  }

  return (await getTripFinishStatus(tripReference)) === 'FINISHED';
}

async function executeOfflineAction(action: OfflineAction): Promise<boolean> {
  const service = TripStatusService();

  switch (action.type) {
    case 'FINISH_TRIP': {
      const finished = await executeFinishWithReconciliation(
        action.tripReference,
        async () => {
          const result = await service.finish(action.tripReference);
          return !!result?.data?.status;
        },
      );
      if (!finished) return false;

      DeviceEventEmitter.emit(OFFLINE_TRIP_FINISHED_EVENT, {
        tripReference: action.tripReference,
      });
      return true;
    }

    case 'FINISH_TAXIMETER_TRIP': {
      const finished = await executeFinishWithReconciliation(
        action.tripReference,
        async () => {
          const finishResult = await service.finish(action.tripReference);
          return !!finishResult?.data?.status;
        },
      );
      if (!finished) return false;

      const taximeterResult = await serviceTaximeter.updateDistanceAndEstimatedTime(
        action.tripReference,
        action.km,
        action.estimatedTripTime,
        action.price,
      );
      if (!taximeterResult?.status) return false;

      storage.removeGroup([OFFLINE_TAXIMETER_FLAG_KEY, OFFLINE_TAXIMETER_INFO_KEY]);

      DeviceEventEmitter.emit(OFFLINE_TRIP_FINISHED_EVENT, {
        tripReference: action.tripReference,
      });
      return true;
    }

    case 'FINISH_TRIP_WITH_RECALC': {
      const finished = await executeFinishWithReconciliation(
        action.tripReference,
        async () => {
          const recalcResult = await service.finishWithRecalc({
            tripReference: action.tripReference,
            oldPrice: action.oldPrice,
            newPrice: action.newPrice,
            newDistance: action.newDistance,
            newTripTime: action.newTripTime,
            tolls: action.tolls,
            completeTripAfterRecalc: false,
          });

          const recalcOk = !!recalcResult?.data?.status;
          const recalcAlreadyApplied = isRecalcAlreadyApplied(recalcResult?.data);

          if (!recalcOk && !recalcAlreadyApplied) return false;

          const finishResult = await service.finish(action.tripReference);
          return !!finishResult?.data?.status;
        },
      );
      if (!finished) return false;

      DeviceEventEmitter.emit(OFFLINE_TRIP_FINISHED_EVENT, {
        tripReference: action.tripReference,
        newPrice: action.newPrice,
      });
      return true;
    }

    case 'DOOR_HANDLE_MANUAL': {
      const { data } = await apiMainDriver.post('/KnobTrip/Init', action.payload, {
        timeout: TIMEOUT_LONG,
      });
      return !!data?.status;
    }

    case 'SEND_AVALIATION': {
      await apiMainDriver.post(
        'TripRating/Rate',
        {
          rating: action.rating,
          tripReference: action.tripReference,
        },
        { timeout: TIMEOUT_LONG },
      );
      if (action.blacklistAddresses.length > 0) {
        await apiMainDriver.post(
          'AddressBlacklist/Insert',
          { addresses: action.blacklistAddresses },
          { timeout: TIMEOUT_LONG },
        );
      }
      for (const area of action.riskAreas) {
        apiMainDriver
          .post('riskArea/store', area, { timeout: TIMEOUT_LONG })
          .catch(() => {});
      }
      return true;
    }

    default:
      return false;
  }
}

let isSyncingGlobal = false;

function groupActionsByTrip(actions: OfflineAction[]): OfflineAction[][] {
  const groups = new Map<string, OfflineAction[]>();

  for (const action of actions) {
    const key = 'tripReference' in action ? action.tripReference : action.id;
    const group = groups.get(key);
    if (group) {
      group.push(action);
    } else {
      groups.set(key, [action]);
    }
  }

  return [...groups.values()];
}

async function runActionsInOrder(actions: OfflineAction[]): Promise<void> {
  for (const action of actions) {
    try {
      const success = await executeOfflineAction(action);
      if (success) {
        offlineTripQueue.remove(action.id);
      }
    } catch {
      // sem sucesso: a ação permanece na fila e o próximo ciclo tenta de novo
    }
  }
}

async function drainOfflineQueue(): Promise<void> {
  if (isSyncingGlobal) return;

  const pending = offlineTripQueue.getAll();
  if (pending.length === 0) return;

  isSyncingGlobal = true;
  DeviceEventEmitter.emit(OFFLINE_SYNC_STATUS_EVENT, true);

  const groups = groupActionsByTrip(pending);
  await Promise.allSettled(groups.map((group) => runActionsInOrder(group)));

  isSyncingGlobal = false;
  DeviceEventEmitter.emit(OFFLINE_SYNC_STATUS_EVENT, false);
}

export function useOfflineTripActions() {
  const { itsNetwork } = useNetwork();
  const prevNetworkRef = useRef(itsNetwork);
  const [isSyncing, setIsSyncing] = useState(isSyncingGlobal);
  const [actions, setActions] = useState<OfflineAction[]>(() =>
    offlineTripQueue.getAll(),
  );

  const refreshActions = useCallback(() => {
    setActions(offlineTripQueue.getAll());
  }, []);

  useEffect(() => {
    const queueSub = DeviceEventEmitter.addListener(
      OFFLINE_QUEUE_CHANGED_EVENT,
      refreshActions,
    );
    const syncSub = DeviceEventEmitter.addListener(
      OFFLINE_SYNC_STATUS_EVENT,
      setIsSyncing,
    );

    return () => {
      queueSub.remove();
      syncSub.remove();
    };
  }, [refreshActions]);

  useEffect(() => {
    const wasOffline = !prevNetworkRef.current;
    prevNetworkRef.current = itsNetwork;

    if (!itsNetwork) return;

    if (wasOffline || offlineTripQueue.getAll().length > 0) {
      drainOfflineQueue();
    }
  }, [itsNetwork]);

  useEffect(() => {
    if (!itsNetwork) return;
    if (actions.length === 0) return;

    drainOfflineQueue();

    const interval = setInterval(() => {
      drainOfflineQueue();
    }, RETRY_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [itsNetwork, actions]);

  const pendingFinishActions = useMemo(
    () => actions.filter(isFinishOfflineAction),
    [actions],
  );

  return {
    isSyncing,
    pendingCount: actions.length,
    hasPendingActions: actions.length > 0,
    pendingFinishActions,
    drainQueue: drainOfflineQueue,
    refreshCount: refreshActions,
  };
}
