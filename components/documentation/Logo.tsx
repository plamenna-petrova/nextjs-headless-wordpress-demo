import Image from 'next/image'

export function Logo() {
  return (
    <div className="relative flex h-10 items-center">
      <Image
        src="/NextJS-Headless-WordPress-Demo-Logo.jpg"
        alt="Next.js Logo"
        width={48}
        height={48}
        className="mr-1 w-auto"
      />
    </div>
  )
}