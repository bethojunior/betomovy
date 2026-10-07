import React from 'react'
import { FiX } from 'react-icons/fi'
import { DropdownContent, DropdownHeader } from './styles'

interface FooterDropdownProps {
  isOpen: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
}

/** Popup compartilhado pelos cards do rodapé (Canceladas/Não atendidas/Abandonadas) — título + botão de fechar padronizados. */
export const FooterDropdown: React.FC<FooterDropdownProps> = ({ isOpen, title, onClose, children }) => (
  <DropdownContent
    isOpen={isOpen}
    data-dropdown
    onMouseDown={(event) => event.stopPropagation()}
    onClick={(event) => event.stopPropagation()}
  >
    <DropdownHeader>
      <h4>{title}</h4>
      <button
        type="button"
        aria-label="Fechar"
        onClick={(event) => {
          event.stopPropagation()
          onClose()
        }}
      >
        <FiX />
      </button>
    </DropdownHeader>
    {children}
  </DropdownContent>
)
