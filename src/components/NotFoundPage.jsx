import { LiquidMetalButton } from './LiquidMetalButton.jsx'
import { Reveal } from './Reveal.jsx'

const BASE_URL = import.meta.env.BASE_URL

export default function NotFoundPage() {
  return (
    <section className="relative w-full max-w-[1280px] mx-auto px-6 pt-24 pb-32 md:pt-36 md:pb-44">
      <div className="flex flex-col items-center text-center">
        <Reveal delay={0}>
          <p className="text-[120px] sm:text-[160px] font-bold leading-none tracking-[-4px] text-[#E0EC38] select-none">
            404
          </p>
        </Reveal>
        <Reveal delay={100}>
          <h1 className="mt-4 text-[28px] sm:text-[36px] font-bold tracking-[-0.96px] text-[#1A1C1C] dark:text-[#F2F2F1]">
            Page Not Found
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mt-4 max-w-[480px] text-[15px] leading-[26px] text-[#45483F] dark:text-[#A1A1AA]">
            The page you are looking for doesn&apos;t exist or has moved. Head back home or explore
            our services and contact page.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <LiquidMetalButton
              variant="light"
              label="Back to Home"
              showArrow
              onClick={() => {
                window.location.href = BASE_URL
              }}
            />
            <a
              href={`${BASE_URL}services`}
              className="text-[14px] font-semibold text-[#3D4D2B] underline underline-offset-4 hover:text-[#1A1C1C] dark:text-[#AAB95F] dark:hover:text-[#F2F2F1]"
            >
              Browse Services
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}