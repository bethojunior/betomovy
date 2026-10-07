import { createContext, useContext, useMemo } from "react";
import { HolderOutlined } from "@ant-design/icons";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { DraggableSyntheticListeners } from "@dnd-kit/core";

interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: DraggableSyntheticListeners;
}

const RowContext = createContext<RowContextProps>({});

export const DragHandle = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);

  return (
    <HolderOutlined
      ref={setActivatorNodeRef}
      style={{ cursor: listeners ? "grab" : "not-allowed" }}
      {...listeners}
    />
  );
};

interface DraggableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": number;
  disabled?: boolean;
}

export const DraggableRow = ({ disabled, ...restProps }: DraggableRowProps) => {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: restProps["data-row-key"], disabled });

  const style: React.CSSProperties = {
    ...restProps.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 999 } : {}),
  };

  const contextValue = useMemo(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners]
  );

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...restProps} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};
