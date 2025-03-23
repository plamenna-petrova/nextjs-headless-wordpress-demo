import Image from 'next/image'

export function Logo() {
  return (
    <div className="relative flex h-10 items-center h-6">
      <Image
        src="/next.svg"
        alt="Next.js Logo"
        width={48}
        height={48}
        className="mr-1 h-full w-auto"
      />
    </div>
  )
}