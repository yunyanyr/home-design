'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from "next-intl";
import { useState } from 'react'

export default function FAQ() {

  const t = useTranslations("home.FAQ");
  const [showMore, setShowMore] = useState(false);
  return (
    <section className="md:py-20 py-15 bg-white">
      <div className="container mx-auto px-4">

        <h3 className="text-center  text-hero md:text-5xl text-[28px] font-bold md:mb-9 mb-5">
          FAQ
        </h3>


        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
            <AccordionItem value="item-1" className="data-[state=open]:bg-[#F2FAF7] py-7 px-6 data-[state=open]:mb-8 data-[state=closed]:pt-0 md:data-[state=open]:border-l-4 data-[state=open]:border-l-0 md:data-[state=open]:border-t-0 data-[state=open]:border-t-4 border-[#25826C]">
              <AccordionTrigger className="font-bold text-hero "><span className="text-xl">{t('q1')}</span></AccordionTrigger>
              <AccordionContent className="text-[#25826C] text-lg pt-4 pb-0">
                {t('a1')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="data-[state=open]:bg-[#F2FAF7] py-7 px-6 data-[state=open]:mb-8 data-[state=closed]:pt-0 md:data-[state=open]:border-l-4 data-[state=open]:border-l-0 md:data-[state=open]:border-t-0 data-[state=open]:border-t-4 border-[#25826C]">
              <AccordionTrigger className="font-bold text-hero "><span className="text-xl">{t('q2')}</span></AccordionTrigger>
              <AccordionContent className="text-[#25826C] text-lg pt-4 pb-0">
                {t('a2')}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="data-[state=open]:bg-[#F2FAF7] py-7 px-6 data-[state=open]:mb-8 data-[state=closed]:pt-0 md:data-[state=open]:border-l-4 data-[state=open]:border-l-0 md:data-[state=open]:border-t-0 data-[state=open]:border-t-4 border-[#25826C]">
              <AccordionTrigger className="font-bold text-hero "><span className="text-xl">{t('q3')}</span></AccordionTrigger>
              <AccordionContent className="text-[#25826C] text-lg pt-4 pb-0">
                {t('a3')}
              </AccordionContent>
            </AccordionItem>
            {
              showMore && <>
                <AccordionItem value="item-4" className="data-[state=open]:bg-[#F2FAF7] py-7 px-6 data-[state=open]:mb-8 data-[state=closed]:pt-0 md:data-[state=open]:border-l-4 data-[state=open]:border-l-0 md:data-[state=open]:border-t-0 data-[state=open]:border-t-4 border-[#25826C]">
                  <AccordionTrigger className="font-bold text-hero "><span className="text-xl">{t('q4')}</span></AccordionTrigger>
                  <AccordionContent className="text-[#25826C] text-lg pt-4 pb-0">
                    {t('a4')}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5" className="data-[state=open]:bg-[#F2FAF7] py-7 px-6 data-[state=open]:mb-8 data-[state=closed]:pt-0 md:data-[state=open]:border-l-4 data-[state=open]:border-l-0 md:data-[state=open]:border-t-0 data-[state=open]:border-t-4 border-[#25826C]">
                  <AccordionTrigger className="font-bold text-hero "><span className="text-xl">{t('q5')}</span></AccordionTrigger>
                  <AccordionContent className="text-[#25826C] text-lg pt-4 pb-0">
                    {t('a5')}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-6" className="data-[state=open]:bg-[#F2FAF7] py-7 px-6 data-[state=open]:mb-8 data-[state=closed]:pt-0 md:data-[state=open]:border-l-4 data-[state=open]:border-l-0 md:data-[state=open]:border-t-0 data-[state=open]:border-t-4 border-[#25826C]">
                  <AccordionTrigger className="font-bold text-hero "><span className="text-xl">{t('q6')}</span></AccordionTrigger>
                  <AccordionContent className="text-[#25826C] text-lg pt-4 pb-0">
                    {t('a6')}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-7" className="data-[state=open]:bg-[#F2FAF7] py-7 px-6 data-[state=open]:mb-8 data-[state=closed]:pt-0 md:data-[state=open]:border-l-4 data-[state=open]:border-l-0 md:data-[state=open]:border-t-0 data-[state=open]:border-t-4 border-[#25826C]">
                  <AccordionTrigger className="font-bold text-hero "><span className="text-xl">{t('q7')}</span></AccordionTrigger>
                  <AccordionContent className="text-[#25826C] text-lg pt-4 pb-0">
                    {t('a7')}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-8" className="data-[state=open]:bg-[#F2FAF7] py-7 px-6 data-[state=open]:mb-8 data-[state=closed]:pt-0 md:data-[state=open]:border-l-4 data-[state=open]:border-l-0 md:data-[state=open]:border-t-0 data-[state=open]:border-t-4 border-[#25826C]">
                  <AccordionTrigger className="font-bold text-hero "><span className="text-xl">{t('q8')}</span></AccordionTrigger>
                  <AccordionContent className="text-[#25826C] text-lg pt-4 pb-0">
                    {t('a8')}
                  </AccordionContent>
                </AccordionItem>
              </>
            }
          </Accordion>

          <button
            onClick={() => { setShowMore(!showMore) }}
            className="cursor-pointer rounded-[100px] bg-[#F2FAF7] text-[#25826C] border-1 border-[#25826C] text-center text-xl py-2 px-4.5"
          > {
              showMore ? <span className="flex items-center">
                <ChevronUp />
                {
                  t('closeMore')
                }
              </span> :
                <span className="flex items-center">
                  <ChevronDown />
                  {
                    t('showMore')
                  }
                </span>
            }</button>


        </div>
      </div>
    </section>
  );
} 