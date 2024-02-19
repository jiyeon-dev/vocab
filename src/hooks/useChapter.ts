import { validation } from "@/util";
import { useSubmit } from "react-router-dom";
import { toast } from "sonner";
import { WordType } from "./useInputWords";

export default function useChapter(words: WordType[]) {
  const submit = useSubmit();

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    categoryId: string
  ) => {
    event.preventDefault();
    if (!validation.array(words)) {
      toast.error("단어를 입력해 주세요.");
      return;
    }

    const formData = new FormData(event.target as HTMLFormElement);
    formData.append("vocabulary", JSON.stringify(words));
    formData.append("categoryId", categoryId);
    submit(formData, { method: "POST" });
  };

  const handleUpdate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("update chapter");
    if (!validation.array(words)) {
      toast.error("단어를 입력해 주세요.");
      return;
    }

    const formData = new FormData(event.target as HTMLFormElement);
    formData.append("vocabulary", JSON.stringify(words));
    submit(formData, { method: "PUT" });
  };

  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement>,
    categoryId: string
  ) => {
    event.preventDefault();
    const proceed = window.confirm("삭제하시겠습니까?");
    if (proceed) {
      const formData = new FormData();
      formData.append("categoryId", categoryId);
      submit(formData, { method: "DELETE" });
    } else {
      return;
    }
  };

  return {
    handleSubmit,
    handleUpdate,
    handleDelete,
  };
}
