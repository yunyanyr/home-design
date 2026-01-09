'use client'
import Image from 'next/image';
import { useTranslations } from "next-intl";
import { Link } from '@/i18n/navigation';
import useMobile from '@/app/hooks/useMobile';
export default function Share() {
  const t = useTranslations("home.share");
  const isMobile = useMobile();

  return (
    <section className="md:py-40 py-15 bg-secondary relative overflow-hidden">
      <div className="container mx-auto md:px-4 px-8 ">
        {
          isMobile ? <img src="/images/hero/ratio2.png" alt="" className='object-contain absolute top-0 left-1/2 -translate-x-1/2 w-full h-auto' /> :
            <img src="/images/hero/ratio.png" alt="" className='object-contain absolute top-0 left-0 w-auto h-auto' />
        }

        <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-24 max-w-6xl mx-auto">
          <div className='relative'>
            <Image
              src='/images/hero/empty.png'
              alt='分享您的平面图'
              width={588}
              height={331}
              className="object-contain z-10"
            />

          </div>


          <div className='flex-grow flex flex-col gap-6 items-center md:items-end '>
            <h3 className="text-hero md:text-5xl text-[28px] md:text-right font-bold">
              {t("title")}
            </h3>
            <p className="text-secondary-foreground md:text-xl  md:text-right text-center max-w-90">
              {t("description")}
            </p>
            <Link
              href="/design"
              className="cursor-pointer inline-flex md:mt-9 font-bold px-10 py-3 bg-button-primary text-white rounded-full md:text-2xl hover:bg-primary/90 transition-colors items-center gap-2"
            >
              {t("cta")}
            </Link>
          </div>




        </div>

      </div>
    </section>
  );
} 