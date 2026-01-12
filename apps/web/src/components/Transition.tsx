import { startTransition } from "react";
import { useNavigate } from "react-router";

interface VTLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const VTLink = ({ to, children, className }: VTLinkProps) => {
  const navigate = useNavigate();

  return (
    <button
      className={className}
      onClick={() => {
        startTransition(() => {
          navigate(to);
        });
      }}
    >
      {children}
    </button>
  );
};
export default VTLink;
