import styled from 'styled-components';

export const BonusCard = styled.div`
  margin: 0.5rem 0;
  background-color: #FFFFFF;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: #389E0D;
  }
`;

export const BonusHeader = styled.p`
  margin: 0;
  padding: 0.75rem;
  background-color: #F5F5F5;
  border-bottom: 1px solid #E8E8E8;
  font-size: 13px;
  font-weight: 600;
  color: #333333;
`;

export const BonusEmpty = styled.p`
  margin: 0;
  padding: 0.75rem;
  font-size: 12px;
  color: #8C8C8C;
`;

export const BonusList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const BonusItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #E8E8E8;
  font-size: 12px;

  &:last-child {
    border-bottom: none;
  }
`;

export const BonusLabel = styled.span`
  color: #666666;
`;

export const BonusValue = styled.span`
  font-weight: 600;
  color: #389E0D;
  white-space: nowrap;
`;
