import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { ReactNode } from 'react';

export type PermissionType = 'foreground' | 'camera' | 'audio' | 'notifications';

export type PermissionStatusValue = 'granted' | 'denied' | 'undetermined';

export interface PermissionStatus {
  foreground: Location.PermissionStatus;
  camera: PermissionStatusValue;
  audio: PermissionStatusValue;
  notifications: Notifications.PermissionStatus;
}

export interface PermissionsContextData {
  showPermissionModal: boolean;
  setShowPermissionModal: (show: boolean) => void;
  disabledPermissions: PermissionType[];
  checkPermissions: () => Promise<void>;
  requestAllPermissions: () => Promise<boolean>;
  openSettings: () => void;
  permissionsChecked: boolean;
  showPermissionsModalIfNeeded: () => Promise<void>;
  hasRequiredPermissions: () => Promise<boolean>;
  checkAndShowPermissionModalIfNeeded: () => Promise<boolean>;
}

export interface PermissionModalProps {
  translate: (key: string) => string;
}

export interface PermissionsProviderProps {
  children: ReactNode;
}
