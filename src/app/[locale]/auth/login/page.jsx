'use client'

import { useState, use } from 'react';
import { signIn } from 'next-auth/react';
//import { signIn } from "@/auth";
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { AntdSpin } from "antd-spin";
import { toast } from 'react-toastify';
import { useTranslations } from "next-intl";
export default function LoginPage({ searchParams }) {
    const router = useRouter();
    const t = useTranslations("login");
    const t2 = useTranslations("toast");
    const params = use(searchParams);
    console.log('searchParams', params);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignIn = async (provider) => {
        setIsLoading(true);
        toast.info(t2('loading'), { autoClose: 5000 });
        try {
            // provider, { callbackUrl: '/' }
            await signIn(provider, { redirect: true, redirectTo: params?.callbackUrl || '/' });
            setIsLoading(false);

        } catch (error) {
            console.error(`Error signing in with ${provider}:`, error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar from='login' />
            <AntdSpin spinning={isLoading} fullscreen={true} tip={t2('loading2')} className='bg-[#fff9]' />
            <div className="flex flex-col items-center bg-secondary md:bg-gray-50 justify-center px-6 py-12  mx-auto">
                <div className="w-full p-10 space-y-8 bg-secondary md:w-100 md:shadow-lg md:h-auto h-screen">
                    <div className="flex flex-col items-center ">
                        <h1 className="text-5xl font-bold text-primary">HarmoniQ</h1>
                        <p className="mt-16 text-[#086E56] text-sm text-center">
                            {t('tip1')}
                        </p>
                    </div>

                    <div className="mt-8 space-y-4">
                        <button
                            onClick={() => handleSignIn('google')}
                            disabled={isLoading}
                            className={`"cursor-pointer flex items-center justify-center w-full px-4 py-3 font-medium text-white transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2" ${isLoading ? 'bg-muted' : 'bg-button-primary'}`}
                        >
                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    fill="currentColor"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="currentColor"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            {t('Google')}
                        </button>

                        <button
                            onClick={() => handleSignIn('guest')}
                            disabled={isLoading}
                            className={`cursor-pointer flex items-center justify-center w-full px-4 py-3 font-medium text-white transition-colors rounded-full  focus:outline-none focus:ring-2 focus:ring-offset-2 ${isLoading ? 'bg-muted' : 'bg-[#25826D]'}`}
                        >
                            <svg className="w-5 h-5 mr-2" t="1748329994186" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2383" width="20" height="20"><path d="M505.173333 238.933333c126.293333 0 221.866667-95.573333 221.866667-221.866666 0-10.24-10.24-17.066667-17.066667-17.066667-126.293333 0-221.866667 95.573333-221.866666 221.866667 0 10.24 6.826667 17.066667 17.066666 17.066666zM911.36 720.213333c-3.413333-3.413333-6.826667-6.826667-10.24-6.826666-78.506667-13.653333-139.946667-85.333333-139.946667-167.253334 0-68.266667 40.96-129.706667 105.813334-157.013333 3.413333-3.413333 10.24-6.826667 10.24-10.24s0-10.24-3.413334-13.653333c-51.2-68.266667-119.466667-92.16-163.84-92.16-40.96 0-75.093333 10.24-105.813333 20.48-30.72 6.826667-58.026667 13.653333-81.92 13.653333-27.306667 0-58.026667-6.826667-88.746667-17.066667-37.546667-6.826667-78.506667-17.066667-116.053333-17.066666-85.333333 0-204.8 109.226667-204.8 307.2s133.12 443.733333 238.933333 443.733333c58.026667 0 92.16-13.653333 119.466667-23.893333 17.066667-6.826667 34.133333-10.24 51.2-10.24s30.72 6.826667 51.2 10.24c27.306667 10.24 61.44 23.893333 119.466667 23.893333 85.333333 0 174.08-150.186667 218.453333-290.133333 3.413333-3.413333 0-6.826667 0-13.653334z" fill="#ffffff" p-id="2384"></path></svg>
                            以访客身份使用

                        </button>
                    </div>

                    <div className="mt-4 text-center text-sm text-gray-400">
                        {t('tip2')}
                    </div>
                </div>
            </div>
        </div>
    );
} 