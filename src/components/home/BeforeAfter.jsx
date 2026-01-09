
import Image from 'next/image';
import { useTranslations } from "next-intl";
import { Link } from '@/i18n/navigation';

export default function BeforeAfter() {
  const t = useTranslations("home.compare");
  return (
    <section className="pt-0 pb-40 bg-secondary relative overflow-hidden">
      <div className="container mx-auto md:px-4 px-8 ">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24 max-w-6xl mx-auto">




          <div className='flex-grow flex flex-col gap-6 items-center md:items-start'>
            <h3 className="text-hero md:text-5xl text-[28px]  font-bold">
              {t("title")}
            </h3>
            <p className="text-secondary-foreground md:text-xl md:text-left text-center max-w-90">
              {t("description")}
            </p>
            <Link
              href="/design"
              className="cursor-pointer inline-flex md:mt-9 font-bold px-10 py-3 bg-button-primary text-white rounded-full md:text-2xl hover:bg-primary/90 transition-colors items-center gap-2"
            >
              {t("cta")}
            </Link>
          </div>
          <div className='relative'>
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10'>
              <div className='w-15 h-15 rounded-full bg-white flex items-center justify-center'>
                <Image
                  src='/images/hero/arrow.png'
                  alt=''
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>

            </div>
            <Image
              src='/images/hero/compare.png'
              alt='对比'
              width={588}
              height={331}
              className="object-contain"
            />
            <div className='absolute w-full bottom-0 left-0 p-4 flex items-center justify-between'>
              <button className='bg-[#D9D9D9CC] text-white px-4 py-2 rounded-[10px] md:text-xl text-[12px]'>{t('before')}</button>
              <button className='bg-[#25826CCC] text-white px-4 py-2 rounded-[10px] md:text-xl text-[12px]'>{t('after')}</button>
            </div>
          </div>


        </div>

      </div>
    </section>
  );
} 