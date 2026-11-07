import styled from "styled-components";

export const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;

  .ant-table {
    border-radius: 0 0 16px 16px;
    font-size: 13px;
  }

  .ant-table-thead > tr > th {
    background: #f8fafc;
    color: #475569;
    font-weight: 700;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1.5px solid #e2e8f0;
    padding: 14px 16px;
  }

  .ant-table-tbody > tr > td {
    padding: 14px 16px;
    border-bottom: 1px solid #f1f5f9;
    color: #1e293b;
    vertical-align: middle;
  }

  .ant-table-tbody > tr:hover > td {
    background: #f8fafc !important;
  }

  .ant-table-pagination {
    padding: 16px 20px;
    margin: 0 !important;
    border-top: 1px solid #f1f5f9;
  }
`;

export const TitleCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .title-text {
    font-weight: 700;
    color: #0f172a;
    font-size: 14px;
    line-height: 1.3;
  }

  .date-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: #64748b;
    font-weight: 500;
  }
`;

export const MessageCell = styled.div`
  font-size: 13px;
  color: #475569;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 320px;
`;

export const ActionCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ImageThumbnail = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.08);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
