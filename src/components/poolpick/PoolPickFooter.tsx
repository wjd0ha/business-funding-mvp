type PoolPickFooterProps = {
  notices: string[];
};

export function PoolPickFooter({ notices }: PoolPickFooterProps) {
  return (
    <footer className="border-t border-[#ccfbf1] bg-[#f0fdfa]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-base font-black text-[#0f3331]">
            <span className="flex size-8 items-center justify-center rounded-full bg-[#0d9488] text-xs font-black text-white">
              PP
            </span>
            풀픽 PoolPick
          </div>
          <p className="text-sm font-bold text-[#4b6661]">
            3D 시뮬레이션 기반 수영장 설계·시공 비교·구독 관리 플랫폼
          </p>
        </div>

        <div className="mt-6 rounded-lg bg-white p-4 ring-1 ring-[#ccfbf1]">
          <ul className="grid gap-2 text-xs leading-5 text-[#4b6661] sm:text-sm sm:leading-6">
            {notices.map((notice) => (
              <li key={notice}>- {notice}</li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-xs font-bold text-[#7c9c96]">
          © {new Date().getFullYear()} PoolPick. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
