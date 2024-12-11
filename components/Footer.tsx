import Link from 'next/link'

const Footer: React.FC = () => {
  return (
    <footer className="flex flex-col gap-2 w-full p-6 pb-10 bg-[--gray-1] text-[--gray-12] text-center">
      <div className="flex justify-center text-sm font-medium gap-4">
        <Link
          href="/privacy"
          className="transition-all ease-in-out duration-300 hover:tracking-wide hover:text-[--indigo-11]"
        >
          Datenschutz
        </Link>
        <Link
          href="/imprint"
          className="transition-all ease-in-out duration-300 hover:tracking-wide hover:text-[--indigo-11]"
        >
          Impressum
        </Link>
      </div>
      <div className="text-sm font-medium">
        &copy; {new Date().getFullYear()} WaterGuardian
      </div>
    </footer>
  )
}

export default Footer
