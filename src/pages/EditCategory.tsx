import Loading from "@/components/Loader";
import { Button } from "@/components/ui/button";
import {
  FormItem,
  Input,
  Textarea,
  InputImage,
} from "@/components/ui/formItem";
import { createFile, validation } from "@/util";
import {
  deleteCategory,
  getCategory,
  queryClient,
  updateCategory,
  uploadImage,
} from "@/util/http";
import { DocumentData } from "firebase/firestore";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  Form,
  useNavigation,
  Link,
  redirect,
  useSubmit,
  useRouteLoaderData,
  json,
  defer,
  Await,
} from "react-router-dom";
import { toast } from "sonner";

const NO_IMAGE = "/no-image.jpeg";

export default function EditCategory() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [imgPreview, setImgPreview] = useState<string>(NO_IMAGE);
  const submit = useSubmit();
  const imgRef = useRef<HTMLInputElement>(null);
  const [isImageChanged, setIsImageChanged] = useState(false);

  const { data } = useRouteLoaderData("category-detail") as DocumentData;

  useEffect(() => {
    // 언마운트시 ObjectURL 삭제하여 메모리 누수 방지
    return () => {
      URL.revokeObjectURL(imgPreview);
    };
  }, []);

  // 이미지 표시
  useEffect(() => {
    const fetchFile = async () => {
      if (!data || !imgRef.current) return;
      const file = await createFile(
        "",
        data.metadata.name,
        data.metadata.contentType
      );
      const container = new DataTransfer();
      container.items.add(file);
      imgRef.current.files = container.files;
      setImgPreview(data.imageURL);
    };
    if (data) fetchFile();
  }, [data]);

  // 이미지 변경 시 미리보기 표시
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = (event.target as HTMLInputElement).files;
    const url =
      files && files.length > 0 ? URL.createObjectURL(files[0]) : NO_IMAGE;
    setImgPreview(url);
    setIsImageChanged(true);
  };

  // 카테고리 삭제
  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const proceed = window.confirm("삭제하시겠습니까?");
    if (proceed) {
      submit(null, { method: "delete" });
    }
  };

  // 카테고리 수정
  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    formData.append("isImageChanged", JSON.stringify(isImageChanged));
    submit(formData, { method: "put", encType: "multipart/form-data" });
  };

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Await resolve={data}>
          {(data) => (
            <Form onSubmit={handleUpdate}>
              <FormItem label='이름'>
                <Input
                  type='text'
                  name='name'
                  placeholder='category'
                  maxLength={10}
                  defaultValue={data.name}
                  required
                />
              </FormItem>
              <FormItem label='설명'>
                <Textarea
                  placeholder='description'
                  name='description'
                  className='resize-none mt-1'
                  rows={4}
                  maxLength={50}
                  defaultValue={data.description}
                  required
                />
              </FormItem>
              <FormItem label='이미지'>
                <div className='flex items-start space-x-4'>
                  <div>
                    <InputImage
                      ref={imgRef}
                      name='image'
                      onChange={handleImageChange}
                      required
                    />
                    <span></span>
                  </div>
                  <img
                    id='preview'
                    className='object-cover w-24 h-24 rounded-sm'
                    src={imgPreview}
                    alt='Current profile photo'
                  />
                </div>
              </FormItem>

              <div className='flex justify-center space-x-4 mt-2'>
                <Link to='..'>
                  <Button variant='outline' disabled={isSubmitting}>
                    Cancel
                  </Button>
                </Link>
                <Button
                  variant='destructive'
                  disabled={isSubmitting}
                  onClick={handleDelete}
                >
                  {isSubmitting ? "Submitting..." : "Delete"}
                </Button>
                <Button type='submit' disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Save"}
                </Button>
              </div>
            </Form>
          )}
        </Await>
      </Suspense>

      {isSubmitting && <Loading />}
    </>
  );
}

export const loader = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);
  const categoryId = url.searchParams.get("categoryId") || "";
  if (!categoryId)
    throw json(
      { message: "카테고리 아이디를 찾을 수 없습니다." },
      { status: 500 }
    );

  return defer({
    data: await getCategory({ categoryId }),
  });
};

export const action = async ({
  request,
}: {
  request: Request;
}): Promise<Response | null> => {
  const url = new URL(request.url);
  const categoryId = url.searchParams.get("categoryId") || "";

  if (request.method === "DELETE") {
    const response = await deleteCategory(categoryId);
    if (!response) return null;
    else toast.success("삭제되었습니다.");
  } else if (request.method === "PUT") {
    const formData = await request.formData();
    const data = await Object.fromEntries(formData);
    // 전송할 신규 데이터
    const newData: { [k: string]: FormDataEntryValue } = {
      name: data.name,
      description: data.description,
    };

    // 이미지 체크
    const image = data.image as File;
    const isImageChanged = data.isImageChanged === "true";
    if (!validation.image(image, isImageChanged)) {
      toast.error("이미지가 없습니다.");
      return null;
    }

    // 이미지 업로드
    if (isImageChanged) {
      const uploadedImageResult = await uploadImage(image);
      if (!uploadedImageResult) return null;
      newData["imageURL"] = uploadedImageResult as string;
    }

    // 카테고리 업데이트
    const dataUpdateResult = await updateCategory(categoryId, newData);
    if (!dataUpdateResult) return null;
    else toast.success("변경되었습니다.");
  }

  // 캐시 삭제
  queryClient.invalidateQueries({
    queryKey: ["category", { categoryId }],
  });

  return redirect("/");
};
