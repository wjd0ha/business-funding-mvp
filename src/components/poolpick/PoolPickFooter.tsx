type PoolPickFooterProps = {
  notices: string[];
};

export function PoolPickFooter({ notices }: PoolPickFooterProps) {
  return (
    <footer className="border-t border-[#e3f2fb] bg-[#f8fdff]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-base font-black text-[#0b2540]">
            <span className="flex size-8 items-center justify-center rounded-full bg-[#0ea5e9] text-xs font-black text-white">
              PP
            </span>
            풀픽 PoolPick
          </div>
          <p className="text-sm font-bold text-[#5b6b7c]">
            3D 시뮬레이션 기반 수영장 설계·시공 비교 플랫폼
          </p>
        </div>

        <div className="mt-6 rounded-lg bg-white p-4 ring-1 ring-[#e3f2fb]">
          <ul className="grid gap-2 text-xs leading-5 text-[#5b6b7c] sm:text-sm sm:leading-6">
            {notices.map((notice) => (
              <li key={notice}>- {notice}</li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-xs font-bold text-[#9fb2c4]">
          © {new Date().getFullYear()} PoolPick. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
