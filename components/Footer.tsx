import Link from 'next/link'

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-2 px-4 bg-[--gray-1] text-[--gray-12] text-center">
      <div className="flex justify-center text-sm font-medium gap-x-1">
        <Link
          href="/privacy"
          className="transition-all ease-in-out duration-300 p-2 hover:tracking-wide px-2 hover:text-[--indigo-11]"
        >
          Datenschutz
        </Link>
        <Link
          href="/imprint"
          className="transition-all ease-in-out duration-300 p-2 hover:tracking-wide px-2 hover:text-[--indigo-11]"
        >
          Impressum
        </Link>
      </div>
      <div className="space-x-6 mt-4 text-sm font-medium">
        <p>&copy; {new Date().getFullYear()} WaterGuardian</p>
      </div>
    </footer>
  )
}

export default Footer
