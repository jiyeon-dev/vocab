import { ButtonTooltip } from "@/components/ui/tooltip";
import { FaRegQuestionCircle } from "react-icons/fa";

export default function HelperButton({ onHelper }) {
  return (
    <ButtonTooltip text='Restart Test' onClick={() => onHelper(true)}>
      <FaRegQuestionCircle size={24} style={{ fill: "var(--shadow-color)" }} />
    </ButtonTooltip>
  );
}
