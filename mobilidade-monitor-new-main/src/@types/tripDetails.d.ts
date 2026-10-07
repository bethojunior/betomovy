/**
 * Tipos e interfaces para a página de detalhes de viagem
 */

export type PositionInterface = [number, number]

export interface CoordinateItemInterface extends Array<number> {}

export interface CoordinateInterface extends Array<CoordinateItemInterface> {}

export type TypeStatus = {
  [key: string]: string
}

export type TypesAlertStatusProps = 'success' | 'info' | 'warning' | 'error'

export interface EventItem {
  description: string
  position: CoordinateItemInterface
  icon: string
  date: string | null
}

export interface EventList extends Array<EventItem> {}

