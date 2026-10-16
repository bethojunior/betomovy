type PendingOverlayPermissionAction = () => void | Promise<void>;

let pendingAction: PendingOverlayPermissionAction | null = null;

export function setPendingOverlayPermissionAction(action: PendingOverlayPermissionAction): void {
  pendingAction = action;
}

export async function runPendingOverlayPermissionAction(): Promise<void> {
  const action = pendingAction;
  pendingAction = null;

  if (action) {
    await action();
  }
}
