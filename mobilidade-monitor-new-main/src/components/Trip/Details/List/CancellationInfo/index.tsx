import { FC } from 'react'
import { CANCELED_BY_LABEL, resolveCanceledBy } from '../../../../../utils/tripCancellation'
import { formatDateTime } from '../../../../../utils/formatters'
import { CanceledByBadge, ItemList, Information, SectionList } from '../styles'

interface CancellationInfoProps {
  canceledBy?: string | null
  status?: string | null
  cancellationReasons?: string | null
  cancellationDate?: string | null
}

export const CancellationInfo: FC<CancellationInfoProps> = ({
  canceledBy,
  status,
  cancellationReasons,
  cancellationDate
}) => {
  const responsible = resolveCanceledBy(canceledBy, status)

  if (!responsible) return null

  const parsedDate = cancellationDate ? new Date(cancellationDate) : null
  const hasValidDate = Boolean(parsedDate && !isNaN(parsedDate.getTime()))

  return (
    <>
      <SectionList>
        <ItemList>Cancelado por</ItemList>
        <CanceledByBadge $type={responsible}>{CANCELED_BY_LABEL[responsible]}</CanceledByBadge>
      </SectionList>
      {cancellationReasons && (
        <SectionList>
          <ItemList>Motivo do cancelamento</ItemList>
          <Information>{cancellationReasons}</Information>
        </SectionList>
      )}
      <SectionList>
        <ItemList>Data/hora do cancelamento</ItemList>
        <Information>
          {hasValidDate ? formatDateTime(cancellationDate as string) : 'Não disponível'}
        </Information>
      </SectionList>
    </>
  )
}
