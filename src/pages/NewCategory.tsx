import { Button } from "@/components/ui/button";
import {
  FormItem,
  Input,
  Textarea,
  InputImage,
} from "@/components/ui/formItem";

// 이미지 변경 시 미리보기 표시
const onLoadImage = function (event: React.ChangeEvent<HTMLInputElement>) {
  const input = event.target as HTMLInputElement;
  const files: FileList | null = input.files;
  const imgEl = document.getElementById("preview") as HTMLImageElement;

  if (files && files.length > 0 && imgEl) {
    imgEl.src = URL.createObjectURL(files[0]);
    imgEl.onload = function () {
      URL.revokeObjectURL(imgEl.src);
    };
  } else {
    imgEl.src = "/no-image.jpeg";
    imgEl.onload = function () {
      URL.revokeObjectURL(imgEl.src);
    };
  }
};

export default function NewCategory() {
  return (
    <form>
      <FormItem label='이름'>
        <Input type='text' name='name' placeholder='category' maxLength={10} />
      </FormItem>
      <FormItem label='설명'>
        <Textarea
          placeholder='description'
          name='description'
          className='resize-none mt-1'
          rows={4}
          maxLength={50}
        />
      </FormItem>
      <FormItem label='이미지'>
        <div className='flex items-start space-x-4'>
          <InputImage name='image' onChange={onLoadImage} />
          <img
            id='preview'
            className='object-cover w-24 h-24 rounded-sm'
            src='/no-image.jpeg'
            alt='Current profile photo'
          />
        </div>
      </FormItem>

      <div className='flex justify-center space-x-4 mt-2'>
        <Button variant='outline'>Cancel</Button>
        <Button type='submit'>Save</Button>
      </div>
    </form>
  );
}
