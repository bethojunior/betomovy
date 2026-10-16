export interface PhotoReviewActionsProps {
  onRetake: () => void;
  onConfirm: () => void;
  loading?: boolean;
  /** Inset inferior já resolvido por quem chama (lido fora do Modal) — SafeAreaView não mede certo dentro do Modal. */
  bottomInset?: number;
}
