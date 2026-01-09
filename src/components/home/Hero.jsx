'use client'
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useTranslations } from "next-intl";
import useMobile from '../../app/hooks/useMobile';
import { ToastContainer, toast } from 'react-toastify';
export default function Hero() {
  const t = useTranslations("home.hero");
  const isMobile = useMobile();
  return (
    <section className="relative min-h-screen flex items-center">
      <div className="absolute inset-0 z-2 bg-shadow" />
      <div className="absolute inset-0 z-0 w-full">
        <Image
          src="https://d3cbeloe0vn1bb.cloudfront.net/images/hero/heroback.png"
          alt="Hero background"
          fill
          className="object-cover"
          priority={true}
        />

      </div>
      <div className="container mx-auto px-4 relative z-10 -top-20 md:pl-50">
        <div className="max-w-3xl text-white flex flex-col items-center md:block">
          <h1 className="md:text-[52px] text-4xl font-bold mb-16 mt-20 md:mt-0 leading-tight flex flex-col items-center md:items-start">
            <span>{t("title")}</span>
            {
              isMobile ? <>
                <span>{t("title2").split('，')[0]}</span>
                <span>{t("title2").split('，')[1]}</span>
              </> : <span>{t("title2")}</span>
            }

          </h1>
          <p className="md:text-xl text-lg mb-4 font-bold">
            {t("subtitle")}
          </p>
          <Link
            href="/design"
            className="inline-flex font-bold md:pl-16 pl-20 md:pr-10 pr-15 py-3 bg-button-gradient text-white rounded-full md:text-2xl text-xl hover:bg-primary/90 transition-colors items-center gap-2"
          >
            {t("cta")}
            <div className='w-5 h-5 md:w-6 md:h-6 relative'>
              <Image src="/images/hero/star.png" alt="arrow" fill />
            </div>

          </Link>
        </div>
      </div>
    </section>
  )
} 