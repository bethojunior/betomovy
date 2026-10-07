interface IfProps {
  condition: any;
  children: React.ReactNode;
  conditionElse?: any | null;
}

export const If = ({condition, children, conditionElse}: IfProps) => {
  return condition ? children : conditionElse ? conditionElse : null;
};
