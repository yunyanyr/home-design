'use client'
import { useTranslations } from "next-intl";
import { useState } from 'react';
import Image from 'next/image'

export default function () {
    const t = useTranslations("home.tips");
    const [active, setActive] = useState(null)
    const handleClick = (e, index) => {
        e.stopPropagation();
        setActive(index)
    }
    return <section className="md:py-20 py-15 pl-10 overflow-auto relative flex flex-col items-center"
        onClick={() => setActive(null)}
    >
        <h3 className="text-hero md:text-5xl text-[28px] font-bold md:mb-30 mb-5">
            {t("title")}
        </h3>
        <div>
            <div className="flex items-end justify-center border-b-8 border-[#7EAAAB] rounded-sm pb-3 px-5">
                {
                    active == 0 ? <Image priority={true} className="md:mr-2 mr-1" width='224' height='400' src='https://d3cbeloe0vn1bb.cloudfront.net/images/tips/1.png' alt='' /> :
                        <div
                            style={{ writingMode: 'vertical-lr' }}
                            className={`relative md:h-100 h-100 bg-[#F3A542] leading-8 tracking-widest
                   flex items-center justify-center mx-auto text-center text-white rounded-l-none rounded-r-xl md:mr-2 mr-1
                   cursor-pointer md:w-20 w-10 md:text-2xl text-xs
                   `}
                            onClick={(e) => handleClick(e, 0)}

                        >
                            <span>{t("tip1")}</span>
                        </div>
                }
                {
                    active == 1 ? <Image priority={true} className="md:mr-2 mr-1" width='224' height='400' src='https://d3cbeloe0vn1bb.cloudfront.net/images/tips/2.png' alt='' /> :
                        <div
                            style={{ writingMode: 'vertical-lr' }}
                            className={`relative md:h-100 h-100 bg-[#B86464] leading-8 tracking-widest
                   flex items-center justify-center mx-auto text-center text-white rounded-l-none rounded-r-xl md:mr-2 mr-1
                   cursor-pointer md:w-20 w-10 md:text-2xl text-xs
                   `}
                            onClick={(e) => handleClick(e, 1)}

                        >
                            <span>{t("tip2")}</span>
                        </div>
                }
                {
                    active == 2 ? <Image priority={true} className="md:mr-2 mr-1" width='224' height='400' src='https://d3cbeloe0vn1bb.cloudfront.net/images/tips/3.png' alt='' /> :
                        <div
                            style={{ writingMode: 'vertical-lr' }}
                            className={`relative md:h-100 h-100 bg-[#40807D] leading-8 tracking-widest
                   flex items-center justify-center mx-auto text-center text-white rounded-l-none rounded-r-xl md:mr-2 mr-1
                   cursor-pointer md:w-20 w-10 md:text-2xl text-xs
                   `}
                            onClick={(e) => handleClick(e, 2)}

                        >
                            <span>{t("tip3")}</span>
                        </div>
                }
                {
                    active == 3 ? <Image priority={true} className="md:mr-2 mr-1" width='224' height='400' src='https://d3cbeloe0vn1bb.cloudfront.net/images/tips/4.png' alt='' /> :
                        <div
                            style={{ writingMode: 'vertical-lr' }}
                            className={`relative md:h-100 h-100 bg-[#407EA5] leading-8 tracking-widest
                   flex items-center justify-center mx-auto text-center text-white rounded-l-none rounded-r-xl md:mr-2 mr-1
                   cursor-pointer md:w-20 w-10 md:text-2xl text-xs
                   `}
                            onClick={(e) => handleClick(e, 3)}

                        >
                            <span>{t("tip4")}</span>
                        </div>
                }
                {
                    active == 4 ? <Image priority={true} className="md:mr-2 mr-1" width='224' height='400' src='https://d3cbeloe0vn1bb.cloudfront.net/images/tips/5.png' alt='' /> :
                        <div
                            style={{ writingMode: 'vertical-lr' }}
                            className={`relative md:h-100 h-100 bg-[#7A6B9B] leading-8 tracking-widest
                   flex items-center justify-center mx-auto text-center text-white rounded-l-none rounded-r-xl md:mr-2 mr-1
                   cursor-pointer md:w-20 w-10 md:text-2xl text-xs
                   `}
                            onClick={(e) => handleClick(e, 4)}

                        >
                            <span>{t("tip5")}</span>
                        </div>
                }
                {
                    active == 5 ? <Image priority={true} className="md:mr-2 mr-1" width='224' height='400' src='https://d3cbeloe0vn1bb.cloudfront.net/images/tips/6.png' alt='' /> :
                        <div
                            style={{ writingMode: 'vertical-lr' }}
                            className={`relative md:h-100 h-100 bg-[#D782A3] leading-8 tracking-widest
                   flex items-center justify-center mx-auto text-center text-white rounded-l-none rounded-r-xl md:mr-2 mr-1
                   cursor-pointer md:w-20 w-10 md:text-2xl text-xs
                   `}
                            onClick={(e) => handleClick(e, 5)}

                        >
                            <span>{t("tip6")}</span>
                        </div>
                }
            </div>
        </div>


    </section>
}