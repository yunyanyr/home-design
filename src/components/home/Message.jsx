'use client'
import Image from 'next/image';
import { useTranslations } from "next-intl";
import useMobile from '@/app/hooks/useMobile';
export default function Share() {
    const t = useTranslations("home.message");
    const isMobile = useMobile();

    return (
        <section className="pt-14 md:pb-15 pb-8 relative overflow-hidden">
            <div className="container mx-auto p-0">

                <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-24 max-w-6xl mx-auto">
                    <div className='flex items-center md:max-w-154  md:px-4 px-8'>
                        <div className='mr-3 w-1/2'>
                            <Image
                                src='/images/hero/jiyu1.png'
                                alt=''
                                width={303}
                                height={379}
                                className="object-contain mb-5"
                            />

                            <Image
                                src='/images/hero/jiyu2.png'
                                alt=''
                                width={303}
                                height={379}
                                className="object-contain"
                            />


                        </div>
                        <div className='w-1/2'>
                            <Image
                                src='/images/hero/jiyu3.png'
                                alt=''
                                width={303}
                                height={379}
                                className="object-contain"
                            />


                        </div>
                    </div>



                    <div className='flex-grow flex flex-col gap-6 items-center md:items-start  md:px-4 '>
                        <h3 className="text-hero md:text-5xl text-[28px] font-bold">
                            {t("title")}
                        </h3>
                        <p className="whitespace-pre-wrap text-[#6B877D] md:text-xl  bg-[#E8F7F28F] md:rounded-3xl md:max-w-131 md:p-9 p-6">
                            <span className='text-primary mb-3 block'>{t('hello')}</span>

                            {t("description")}
                        </p>

                    </div>




                </div>

            </div>
        </section>
    );
} 