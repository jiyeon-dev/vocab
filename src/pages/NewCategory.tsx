import Loading from "@/components/Loader";
import { Button } from "@/components/ui/button";
import {
  FormItem,
  Input,
  Textarea,
  InputImage,
} from "@/components/ui/formItem";
import { createCategory, queryClient, uploadImage } from "@/util/http";
import { useEffect, useState } from "react";
import { Form, useNavigation, Link, redirect } from "react-router-dom";

const NO_IMAGE = "/no-image.jpeg";

export default function NewCategory() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [imgPreview, setImgPreview] = useState(NO_IMAGE);

  // 이미지 변경 시 미리보기 표시
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = (event.target as HTMLInputElement).files;
    const url =
      files && files.length > 0 ? URL.createObjectURL(files[0]) : NO_IMAGE;
    setImgPreview(url);
  };

  useEffect(() => {
    return () => URL.revokeObjectURL(imgPreview);
  }, [imgPreview]);

  return (
    <>
      <Form method='post' encType='multipart/form-data'>
        <FormItem label='이름'>
          <Input
            type='text'
            name='name'
            placeholder='category'
            maxLength={10}
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
            required
          />
        </FormItem>
        <FormItem label='이미지'>
          <div className='flex items-start space-x-4'>
            <InputImage name='image' onChange={handleImageChange} required />
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
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Save"}
          </Button>
        </div>
      </Form>
      {isSubmitting && <Loading />}
    </>
  );
}

export const action = async ({
  request,
}: {
  request: Request;
}): Promise<Response | null> => {
  const formData = await request.formData();
  const data = await Object.fromEntries(formData);

  // upload Image
  const uploadedImageResult = await uploadImage(data.image as File);
  if (!uploadedImageResult) return null;

  // add category
  const dataSaveResult = await createCategory({
    name: data.name,
    description: data.description,
    imageURL: uploadedImageResult as string,
  });
  if (!dataSaveResult) return null;

  // 캐시 삭제
  await queryClient.invalidateQueries({
    queryKey: ["category"],
  });

  return redirect("/");
};
