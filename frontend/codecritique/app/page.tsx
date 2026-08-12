import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex-1 grid grid-cols-6 w-full">
        <div className="col-span-1 bg-zinc-50 dark:bg-black p-6 border-r border-zinc-200 dark:border-zinc-800">
        </div>
        <div className="col-span-5 bg-zinc-50 dark:bg-black p-6">
        </div>
      </main>
    </div>
  );
}
