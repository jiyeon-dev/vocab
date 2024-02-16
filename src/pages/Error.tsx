import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <main>
      <div className='flex items-center justify-center h-full'>
        <h1
          className='inline-block mr-5 pr-5 text-2xl'
          style={{ borderRight: "1px solid" }}
        >
          {error.status}
        </h1>
        <div className='inline-block'>
          <h2 className='text-sm font-normal m-0'>
            {error.message || "Error"}
          </h2>
        </div>
      </div>
    </main>
  );
}
