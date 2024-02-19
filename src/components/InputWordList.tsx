import { FormItem, Input } from "@/components/ui/formItem";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MdOutlineCancel } from "react-icons/md";
import { InputWordsProps } from "@/hooks/useInputWords";

export default function InputWordList({
  words,
  wordRef,
  meaningRef,
  addWord,
  deleteWord,
}: InputWordsProps) {
  return (
    <>
      <div className='grid grid-cols-7 gap-2'>
        <FormItem label='영어단어' className='col-span-3'>
          <Input
            ref={wordRef}
            type='text'
            placeholder='word'
            autoComplete='off'
            maxLength={20}
          />
        </FormItem>
        <FormItem label='뜻' className='col-span-3'>
          <Input
            ref={meaningRef}
            type='text'
            placeholder='meanings'
            autoComplete='off'
            maxLength={50}
          />
        </FormItem>
        <Button className='mb-4 mt-auto' type='button' onClick={addWord}>
          추가
        </Button>
      </div>

      {/* 테이블 */}
      <Table>
        <TableHeader>
          <TableRow className='block'>
            <TableHead style={{ width: "140px" }}>단어</TableHead>
            <TableHead>뜻</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='block w-full overflow-y-auto h-[200px]'>
          {words.map((item, index) => (
            <TableRow key={index}>
              <TableCell
                className='p-2 break-words'
                style={{ width: "140px", minWidth: "140px" }}
              >
                {item.name}
              </TableCell>
              <TableCell className='p-2 break-words' style={{ width: "250px" }}>
                {item.meanings}
              </TableCell>
              <TableCell className='p-2 w-auto'>
                <Button
                  variant='ghost'
                  type='button'
                  onClick={() => deleteWord(item)}
                >
                  <MdOutlineCancel />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
