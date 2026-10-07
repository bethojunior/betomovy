import styled from 'styled-components'

export const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const ModalHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  > p {
    margin: 0;
    font-weight: 600;
    font-size: 20px;
    color: #1f2937;
  }
`

export const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background-color: #fff;

  &:focus {
    outline: none;
    border-color: #1677ff;
    box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.2);
  }
`

export const ScrollableList = styled.div`
  max-height: 60vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`

export const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 0;
  color: #6b7280;
  font-size: 14px;
`
