
import Image from 'next/image';
import { useTranslations } from "next-intl";
import Carousel from '@/components/ui/emblaCarousel'

export default function () {
    const t = useTranslations("home.comments");
    return (
        <section className="py-25 pb-25 lg:pb-60 bg-secondary relative overflow-hidden">
            <div className="container mx-auto lg:px-4 px-0">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 mx-auto max-w-8xl">




                    <div className='flex-grow flex flex-col gap-6 items-center lg:items-start'>
                        <h3 className="text-hero lg:text-5xl text-[28px]  font-bold">
                            {t("title")}
                        </h3>
                        <p className="text-secondary-foreground lg:text-xl lg:text-left text-center lg:max-w-90 px-8 lg:px-0">
                            {t("description")}
                        </p>

                    </div>
                    <div className='relative w-full lg:w-auto' >
                        <Carousel />
                        <img
                            src='/images/hero/comments-back.png'
                            alt=''

                            className='absolute object-cover left-0 top-0 lg:w-120 lg:h-165 w-full h-62'
                        />


                    </div>


                </div>

            </div>
        </section>
    );
} 