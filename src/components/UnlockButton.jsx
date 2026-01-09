'use client';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

import { get, post, patch } from "@/lib/ajax";
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react'

export default function ({ className }) {
    const t = useTranslations('Navigation');
    const [isLock, setIsLock] = useState(true);
    const { data: session } = useSession();

    useEffect(() => {
        const userId = session?.user?.userId;
        if (userId) {
            const loadData = async () => {
                const { status, message, data: userInfo } = await get(`/api/users/${userId}`)
                if (status == 0) {
                    setIsLock(userInfo.isLock);
                }
            }
            loadData();
        }

    }, [session?.user?.userId]);
    const onClick = async () => {
        //setLoading(true)
        const { status, data, message } = await post(`/api/checkoutSessions`);
        if (status == 0) {
            const { url } = data;
            console.log(data);
            window.open(url, '_self');
        } else {
            toast.error(message);
        }

    }
    return isLock && <button onClick={onClick} className={cn("cursor-pointer font-bold text-[#066952] rounded-[20px] bg-[#A7F7D3] md:px-4 px-1.5 py-1 mr-1 md:mr-6", className)}>
        {t('unlock')}
    </button>


}