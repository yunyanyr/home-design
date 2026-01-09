'use client';
import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import LanguageToggle from './LanguageToggle';
import useMobile from '../app/hooks/useMobile';
import { useSession } from 'next-auth/react'
import { Separator } from "@/components/ui/separator"
import { useTranslations } from "next-intl";
import UnlockButton from "./UnlockButton";
import Avatar from './Avatar';

export default function Navbar({ from }) {
  const t = useTranslations('Navigation');
  const t2 = useTranslations("home.hero");

  const isMobile = useMobile();
  const { data: session } = useSession();
  const isLogined = session?.user?.userId;

  return (
    <nav className="bg-[#066952] h-16 hidden-on-print">
      <div className="px-4 h-full">
        <div className="md:max-w-[80%] mx-auto flex items-center justify-between h-full">
          <div className='flex items-center gap-6'>
            {

              (!isMobile || from !== 'report') && <Link href="/" className="text-2xl font-bold text-white">
                HarmoniQ
              </Link>
            }

            {
              from == 'report' && <>
                <Separator orientation='vertical' className='h-6 hidden md:block' />
                <span className='md:text-xl font-bold text-white'>{t('yourReport')}</span>
              </>
            }
          </div>



          <div className="flex items-center md:space-x-6">
            {!isMobile && <LanguageToggle />}
            {
              from == 'report' && <UnlockButton />
            }
            {
              isLogined && from !== 'login' ? <Avatar /> :
                <Link
                  className='block text-base focus:text-primary text-[white]'
                  href={"/auth/login"}

                >
                  {t2("login")}
                </Link>
            }

          </div>


        </div>
      </div>
    </nav>
  );
}