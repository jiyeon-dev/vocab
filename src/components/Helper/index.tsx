import { useState } from "react";
import HelperButton from "./HelperButton";
import { MemoizedHelper } from "./Helper";

export default function Helper() {
  const [showHelper, setShowHelper] = useState<boolean>(false);
  const handleHelper = (value: boolean) => {
    setShowHelper(value);
  };

  return (
    <div className='flex justify-center'>
      {!showHelper && <HelperButton onHelper={handleHelper} />}
      {showHelper && <MemoizedHelper onHelper={handleHelper} />}
    </div>
  );
}
