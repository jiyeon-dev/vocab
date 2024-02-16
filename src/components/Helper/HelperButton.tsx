import { ButtonTooltip } from "@/components/ui/tooltip";
import { FaRegQuestionCircle } from "react-icons/fa";

export default function HelperButton({ onHelper }) {
  return (
    <ButtonTooltip
      text='도움말'
      sideOffset={"1"}
      onClick={() => onHelper(true)}
    >
      <FaRegQuestionCircle size={24} style={{ fill: "var(--shadow-color)" }} />
    </ButtonTooltip>
  );
}
