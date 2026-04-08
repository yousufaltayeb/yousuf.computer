export default function Footer() {
  return (
    <footer>
      <div className="fade-in max-w-[1200px] mx-auto text-center px-8 py-12">
        <div className="flex items-center gap-4">
          <div className="w-full">
            <hr className="h-[1px] bg-line border-0" />
          </div>
          <div className="w-5 h-5 rounded-full relative overflow-hidden shrink-0" aria-hidden="true">
            <div className="absolute inset-0 bg-contrast" />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-base" />
          </div>
          <div className="w-full">
            <hr className="h-[1px] bg-line border-0" />
          </div>
        </div>
        <p className="mt-8">
          Copyright Yousuf Altayeb - {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
