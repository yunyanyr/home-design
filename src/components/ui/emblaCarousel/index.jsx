// import React from 'react'
// import ReactDOM from 'react-dom/client'
import EmblaCarousel from './EmblaCarousel'
import { useTranslations } from "next-intl";
import './css/embla.css'
import Image from 'next/image';
const OPTIONS = {}
const SLIDE_COUNT = 5

export default function () {
    const t = useTranslations("home.comments");
    const SLIDES = [
        <div className='lg:w-112  w-auto h-80 rounded-2xl  bg-white flex flex-col lg:px-6 lg:py-8 px-3 py-4'>
            <p className='lg:text-xl text-[#111] font-medium mt-1 self-center lg:self-start' >Amanda</p>
            <span className='text-[#888888] self-center lg:self-start text-xs lg:text-base'>{t('p1')}</span>
            <div className='mt-3 flex items-center self-center lg:self-start'>
                <div className='flex'>
                    {Array.from(Array(5).keys()).map(item => (
                        <div className='lg:w-5 lg:h-5 w-3 h-3 relative'>
                            <Image src="/images/hero/vector.png" fill alt="" />
                        </div>

                    ))}
                </div>

                <span className='text-[#111] ml-2 text-xs lg:text-base'>(5.0)</span>
            </div>
            <p className='text-[#888888] leading-6 mt-3 text-sm lg:text-base'>{t('c1')}</p>
        </div>,
        <div className='lg:w-112  w-auto h-80 rounded-2xl  bg-white flex flex-col lg:px-6 lg:py-8 px-3 py-4'>
            <p className='lg:text-xl text-[#111] font-medium mt-1 self-center lg:self-start' >Mr & Mrs Cheng</p>
            <span className='text-[#888888] self-center lg:self-start text-xs lg:text-base'>{t('p2')}</span>
            <div className='mt-3 flex items-center self-center lg:self-start'>
                <div className='flex'>
                    {Array.from(Array(5).keys()).map(item => (
                        <div className='lg:w-5 lg:h-5 w-3 h-3 relative'>
                            <Image src="/images/hero/vector.png" fill alt="" />
                        </div>

                    ))}
                </div>

                <span className='text-[#111] ml-2 text-xs lg:text-base'>(5.0)</span>
            </div>
            <p className='text-[#888888] leading-6 mt-3 text-sm lg:text-base'>{t('c2')}</p>
        </div>,
        <div className='lg:w-112  w-auto h-80 rounded-2xl  bg-white flex flex-col lg:px-6 lg:py-8 px-3 py-4'>
            <p className='lg:text-xl text-[#111] font-medium mt-1 self-center lg:self-start' >Patrick & Sharon</p>
            <span className='text-[#888888] self-center lg:self-start text-xs lg:text-base'>{t('p3')}</span>
            <div className='mt-3 flex items-center self-center lg:self-start'>
                <div className='flex'>
                    {Array.from(Array(5).keys()).map(item => (
                        <div className='lg:w-5 lg:h-5 w-3 h-3 relative'>
                            <Image src="/images/hero/vector.png" fill alt="" />
                        </div>

                    ))}
                </div>

                <span className='text-[#111] ml-2 text-xs lg:text-base'>(5.0)</span>
            </div>
            <p className='text-[#888888] leading-6 mt-3 text-sm lg:text-base'>{t('c3')}</p>
        </div>,
        <div className='lg:w-112  w-auto h-80 rounded-2xl  bg-white flex flex-col lg:px-6 lg:py-8 px-3 py-4'>
            <p className='lg:text-xl text-[#111] font-medium mt-1 self-center lg:self-start' >Steven</p>
            <span className='text-[#888888] self-center lg:self-start text-xs lg:text-base'>{t('p4')}</span>
            <div className='mt-3 flex items-center self-center lg:self-start'>
                <div className='flex'>
                    {Array.from(Array(5).keys()).map(item => (
                        <div className='lg:w-5 lg:h-5 w-3 h-3 relative'>
                            <Image src="/images/hero/vector.png" fill alt="" />
                        </div>

                    ))}
                </div>

                <span className='text-[#111] ml-2 text-xs lg:text-base'>(5.0)</span>
            </div>
            <p className='text-[#888888] leading-6 mt-3 text-sm lg:text-base'>{t('c4')}</p>
        </div>,
        <div className='lg:w-112  w-auto h-80 rounded-2xl  bg-white flex flex-col lg:px-6 lg:py-8 px-3 py-4'>
            <p className='lg:text-xl text-[#111] font-medium mt-1 self-center lg:self-start' >Mr. & Mrs Wong</p>
            <span className='text-[#888888] self-center lg:self-start text-xs lg:text-base'>{t('p5')}</span>
            <div className='mt-3 flex items-center self-center lg:self-start'>
                <div className='flex'>
                    {Array.from(Array(5).keys()).map(item => (
                        <div className='lg:w-5 lg:h-5 w-3 h-3 relative'>
                            <Image src="/images/hero/vector.png" fill alt="" />
                        </div>

                    ))}
                </div>

                <span className='text-[#111] ml-2 text-xs lg:text-base'>(5.0)</span>
            </div>
            <p className='text-[#888888] leading-6 mt-3 text-sm lg:text-base'>{t('c5')}</p>
        </div>,
    ]
    return <EmblaCarousel slides={SLIDES} options={OPTIONS} />
}
