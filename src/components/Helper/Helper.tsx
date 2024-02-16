import React from "react";
import styles from "@/components/Carousel/carousel.module.css";

export function Helper({ onHelper }: { onHelper: (value: boolean) => void }) {
  return (
    <main
      className='absolute top-0 left-0 h-full w-full text-slate-500 font-bold select-none cursor-pointer'
      style={{ backgroundColor: "#0000001c" }}
      onClick={() => onHelper(false)}
    >
      <div className='' style={{ height: "var(--header-height)" }}></div>
      <div className='container'>
        <div
          className={`${styles.card} shadow-sm h-64 m-5 border-slate-400`}
          style={{ backgroundColor: "#0000" }}
        >
          <div className={styles.cardFront}>
            <span className='text-xl xs:text-2xl sm:text-4xl font-semibold break-words'></span>
            {/* star */}
            <div className='flex flex-col items-center absolute top-2 right-1'>
              <button className='border-2 border-slate-400 rounded-full w-12 h-12 cursor-default'></button>
              <span>단어저장</span>
            </div>
            <span className='absolute bottom-0'>(더블클릭 시 뜻 표시)</span>
          </div>
        </div>

        <div className='flex flex-col justify-center items-center mb-3'>
          <span className='leading-6 border-2 border-slate-400 w-24 h-7 rounded-sm'></span>
          <span>현재번호 / 전체수</span>
        </div>

        <div className='row-span-2 flex justify-around items-start mb-5 mx-16'>
          <div className='flex flex-col items-center'>
            <button className='border-2 border-slate-400 rounded-full w-16 h-16 cursor-default'></button>
            <span>이전</span>
          </div>
          <div className='flex flex-col items-center'>
            <button className='border-2 border-slate-400 rounded-full w-16 h-16 cursor-default'></button>
            <span>랜덤</span>
          </div>
          <div className='flex flex-col items-center'>
            <button className='border-2 border-slate-400 rounded-full w-16 h-16 cursor-default'></button>
            <span>다음</span>
          </div>
        </div>
      </div>
    </main>
  );
}

export const MemoizedHelper = React.memo(Helper);
