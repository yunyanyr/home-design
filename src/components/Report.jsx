'use client'
import Navbar from '@/components/Navbar';
import { useRef, useState, useEffect, Suspense, use } from 'react';
import { useSearchParams, useParams, useRouter, } from 'next/navigation';
import useMobile from '@/app/hooks/useMobile';
import useReportDoc from '@/app/hooks/useReportDoc';
import Image from 'next/image';
import emitter from '@/lib/emitter';
import { EVENT_TRANSLATE_STATUS } from '@/types/constants'
import { useTranslations } from 'next-intl';
import UnlockButton from '@/components/UnlockButton';
import Chapter3 from './report/Chapter3';
import MingLi from "./report/MingLi"
import LiuNian from "./report/LiuNian"
import Chapter6 from "./report/Chapter6"
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'react-toastify';
import { useReactToPrint } from "react-to-print";
import { useSession } from 'next-auth/react'
import { get, post, patch } from '@/lib/ajax'
import { AntdSpin } from "antd-spin";
const wuxingColorMap = {
    '金': '#CCBB00',
    '木': '#00991B',
    '水': '#0088CC',
    '火': '#E52918',
    '土': '#BF8F00',
}


// you can use a function to return the target element besides using React refs

export default function ReportPage({ locale }) {

    const isMobile = useMobile();
    const router = useRouter();
    const t = useTranslations('report');
    const t2 = useTranslations("toast");
    const contentRef = useRef(null);


    const sectionRefs = useRef([]);
    const [sections, setSections] = useState([]);
    const [anchorList, setAnchorList] = useState([])

    const [activeIndex, setActiveIndex] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const hideMenuTimer = useRef(null);
    const [isPrinting, setIsPrinting] = useState(false);
    const [isLock, setIsLock] = useState(true);
    const [userInfo, setUserInfo] = useState(null);

    const [mingLiData, setMingLiData] = useState(null);
    const [liuNianData, setLiuNianData] = useState(null);
    const [jiajuProData, setJiaJuData] = useState(null);
    // const [proReportDataObj, setProReportDataObj] = useState({});
    const { loading, reportDocData, assistantData } = useReportDoc(locale, userInfo);

    const handlePrint = useReactToPrint({
        contentRef,
        pageStyle: `
            @page { size: A4;margin:0  }
            @media print {
                body, html {
                    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap');
                    height: auto;
                    font-family: 'SimSun', 'Microsoft YaHei', sans-serif;
                    overflow: initial !important;  // 重要，如果不分页需要加上
                    margin: 0;
                    zoom: 100%;
                }
                .hidden-on-print { display: none !important; }
                .show-on-print { display: block !important;}
                .page-break {
                    margin-top: 1rem;
                    display: block;
                    page-break-before: auto;
                }
                .canvasImage{
                    page-break-inside: avoid;
                    break-inside: avoid;
                }
                img{
                    max-width: 100% !important;
                    height: auto !important;
                    page-break-inside: auto;
                    break-inside: auto;
                }
      }
        `,
        removeAfterPrint: true,
        documentTitle: 'Harmoniq风水家居报告'
    })
    // useEffect(() => {
    //     //触发事件，languageToggle组件监听
    //     emitter.emit(EVENT_TRANSLATE_STATUS, transStatus)
    // }, [transStatus])
    useEffect(() => {

        let sections = [
            {
                title: t('title1'),
                children: [
                    { title: '年柱', },
                    { title: '月柱', },
                    { title: '日柱', },
                    { title: t('shizhu'), },
                ],
            },
            {
                title: t('title2'),
                children: [
                    { title: t('title2-1'), color: '#088C6E', bgColor: '#F7FAF9' },
                    { title: t('title2-2'), color: '#00A637', bgColor: '#F5FAF7' },
                    { title: t('title2-3'), color: '#0A58A6', bgColor: '#F5F8FA' },
                    { title: t('title2-4'), color: '#E52E5C', bgColor: '#FAF5F6' },
                    { title: t('title2-5'), color: '#D9B815', bgColor: '#FCFBF5' },
                    { title: t('title2-6'), color: '#066952', bgColor: '#F7FAF9' },
                ],
            },
            {
                title: t('title3'),
            }
        ];
        let anchorList = [
            {
                id: 'section-0',
                title: '第一章：个人命理基础分析',
                isMain: true,
            },
            {
                id: 'section-0-0',
                title: '年柱',
                isMain: false,
            },
            {
                id: 'section-0-1',
                title: '月柱'
            },
            { id: 'section-0-2', title: '日柱' },
            { id: 'section-0-3', title: '时柱' },

            {
                id: 'section-1',
                title: '第二章：流年运程基础分析',
                isMain: true,
            },
            { id: 'section-1-0', title: '整体运势' },
            { id: 'section-1-1', title: '健康运势' },
            { id: 'section-1-2', title: '事业运势' },
            { id: 'section-1-3', title: '感情运势' },
            { id: 'section-1-4', title: '财运运势' },
            { id: 'section-1-5', title: '总结' },
            {
                id: 'section-2',
                title: '第三章：流年运程基础分析',
                isMain: true,
            },
            {
                id: 'section-3',
                isMain: true,
            },
        ]
        if (isLock) {
            setSections([...sections, { title: t('title4Preview'), }])
            setAnchorList(anchorList)

        } else {
            setSections([
                ...sections,
                { title: t('title4'), },
                { title: t('title5'), },
                { title: t('title6'), }
            ])

            setAnchorList(
                [...anchorList,
                {
                    id: 'section-4',
                    isMain: true,
                }, {
                    id: 'section-5',
                    isMain: true,
                },])

        }
    }, [isLock])


    //sectionRefs.current = anchorList.map(() => null);
    const onPrint = () => {
        setIsPrinting(true);
        setTimeout(() => {
            handlePrint();
        }, 500)
        setTimeout(() => {
            setIsPrinting(false);
        }, 3000)
    }
    // 滚动监听，高亮当前章节
    useEffect(() => {
        const handleScroll = () => {
            const offsets = sectionRefs.current.map(ref => ref ? ref.getBoundingClientRect().top : Infinity);
            const index = offsets.findIndex(offset => offset > 80); // 80为Navbar高度
            setActiveIndex(index === -1 ? anchorList.length - 1 : Math.max(0, index - 1));
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const { data: session } = useSession();

    useEffect(() => {
        const userId = session?.user?.userId;
        if (userId) {
            const loadData = async () => {
                const { status, message, data: userInfo } = await get(`/api/users/${userId}`)
                if (status == 0) {
                    setUserInfo(userInfo);
                    setIsLock(userInfo.isLock);

                }
            }
            loadData();
        }

    }, [session?.user?.userId]);
    // 目录失焦自动隐藏
    useEffect(() => {
        const handleClick = (e) => {
            if (!e.target.closest('.report-menu') && !e.target.closest('.progress-indicator')) {
                setShowMenu(false);
            }
        };
        window.addEventListener('mousedown', handleClick);
        return () => window.removeEventListener('mousedown', handleClick);
    }, []);

    //保存付费报告,更新生成状态
    useEffect(() => {
        const save = async () => {
            const userId = session?.user?.userId;
            if (!userId) return;

            //先存一种语言的数据。然后异步翻译另一种语言再存储。
            //console.log('twProData', twProData);
            const { status } = await patch(`/api/reportUserDoc/${userId}/${locale == 'zh-CN' ? 'zh' : 'tw'}`, { mingLiData, liuNianData, jiajuProData });
            if (status == 0) {
                //成功后更新报告生成状态为已完成，下次不再生成报告
                await post(`/api/users/${userId}`, {
                    genStatus: 'done',
                });
            }

        }
        if (mingLiData && liuNianData && jiajuProData) {
            save();
        }
    }, [mingLiData, liuNianData, jiajuProData])


    // 进度指示器hover/点击显示目录
    const handleProgressEnter = () => {
        clearTimeout(hideMenuTimer.current);
        setShowMenu(true);
    };
    // const handleProgressLeave = () => {
    //     hideMenuTimer.current = setTimeout(() => setShowMenu(false), 200);
    // };

    // 目录点击跳转
    const handleAnchorClick = (idx) => {
        sectionRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // setShowMenu(false);
    };


    if (loading) {
        return <div className="space-y-8 mt-25">
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[70%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[70%]" />
        </div>
    }

    if (!reportDocData) {
        toast.error(t('error'));
        router.push('/design');
        return;
    }

    // console.log('reportDocData:', activeIndex);

    return (
        <div className="relative min-h-screen bg-white">
            {
                !isPrinting && <Navbar from='report' />
            }


            {/* 右侧进度指示器+目录 */}
            <div className="fixed right-4 top-32 z-10" >
                {
                    !isPrinting && <a href="#" className='hidden-on-print  absolute rounded-3xl text-center py-1 w-25 -top-12 right-0  bg-primary text-white' onClick={onPrint}>{t("download")}</a>
                }
                {/* 进度指示器 */}
                <div
                    className="progress-indicator flex flex-col items-center gap-2 cursor-pointer select-none"
                    onMouseEnter={handleProgressEnter}
                    // onMouseLeave={handleProgressLeave}
                    onClick={handleProgressEnter}
                >
                    {anchorList.map((item, idx) => (
                        <div
                            key={item.id}
                            className={`transition-all duration-200 ${item.isMain ? 'w-5 h-5' : 'w-2 h-2'} rounded-full  ${activeIndex === idx ? 'bg-[#20B580]' : 'bg-[#E7F2EE] '}`}
                            style={{ margin: item.isMain ? '8px 0' : '3px 0' }}
                        />
                    ))}
                </div>
                {/* 目录结构 */}
                {showMenu && (
                    <div
                        className="absolute top-0 right-0 report-menu w-56 bg-white shadow-lg rounded-lg py-4 px-4 text-sm max-h-[70vh] overflow-y-auto"
                        tabIndex={-1}
                    >
                        {sections.map((section, i) => (
                            <div key={section.title}>
                                <div
                                    className={`text-sm mb-1 cursor-pointer ${activeIndex === anchorList.findIndex(a => a.id === `section-${i}`) ? 'text-[#20B580]' : ''}`}
                                    onClick={() => handleAnchorClick(anchorList.findIndex(a => a.id === `section-${i}`))}
                                >
                                    {section.title}
                                </div>
                                {section.children?.map((child, j) => (
                                    <div
                                        key={child.title}
                                        className={`text-sm pl-4 py-1 cursor-pointer ${activeIndex === anchorList.findIndex(a => a.id === `section-${i}-${j}`) ? 'text-[#20B580]' : 'text-gray-700'}`}
                                        onClick={() => handleAnchorClick(anchorList.findIndex(a => a.id === `section-${i}-${j}`))}
                                    >
                                        {child.title}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* 正文内容 */}
            <div
                ref={contentRef}
            >
                {/* 第一章 四柱*/}
                <div key='section-0' className="md:max-w-250 mx-auto  md:px-5">
                    <h1
                        ref={el => sectionRefs.current[0] = el}
                        className="md:text-[40px] text-[28px] text-center font-bold my-10 md:mt-30 md:px-0 px-5 text-[#073E31]"
                        id={`section-0`}
                    >
                        {sections[0].title}
                    </h1>
                    <p className='font-bold leading-8 tracking-normal text-justify px-5 md:px-0'>
                        <span className='text-[#073E31]'>{t('p1-1')}</span>{t('p1-2')}
                        <span className='text-[#073E31]'>{t('p1-3')}</span>。
                        <br />
                        {t('p1-4')}
                    </p>


                    {/* 年柱 */}
                    <section className='md:rounded-[26px] rounded-none bg-[#F7FAF9] md:p-10 p-5  md:mt-18 mt-10'>
                        <h2
                            id={`section-0-1`}
                            ref={el => sectionRefs.current[1] = el}
                            className='text-[28px] text-[#073E31] font-bold mb-3'>年柱</h2>
                        <p className='leading-8 text-justify'>
                            {t('p1-5')}
                        </p>
                        {

                            // result.bazi.year
                            Object.entries(reportDocData.nianzhuData).map(([key, value], index) => {


                                return <div key={index} className={`relative mt-8 flex flex-col  items-center gap-12 lg:gap-0 mx-auto ${index == 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                                    <section className={`${index !== 2 && 'lg:max-w-125'} flex-grow`}>
                                        <p className={`leading-8 text-xl font-bold text-[#073E31]`} style={{ color: wuxingColorMap[key.slice(-1)] }}>
                                            {key}

                                        </p>
                                        <p className='leading-8 text-justify'>
                                            {value}
                                        </p>
                                    </section>
                                    {
                                        index !== 2 && <div className={`relative ${index == 0 ? 'lg:-right-20' : 'lg:-left-20'}`}>
                                            <Image
                                                className='w-105 h-75 object-contain'
                                                priority
                                                src={`/images/report/${key.slice(-1)}.png`}
                                                alt={key}
                                                width={420}
                                                height={320}

                                            />
                                        </div>
                                    }

                                </div>
                            })
                        }
                    </section>
                    {/* 月柱 */}
                    <section className='md:rounded-[26px] rounded-none bg-[#F7FAF9] md:p-10 p-5  md:mt-18 mt-10'>
                        <h2
                            id={`section-0-2`}
                            ref={el => sectionRefs.current[2] = el}
                            className='text-[28px] text-[#073E31] font-bold mb-3'>月柱</h2>
                        <p className='leading-8 text-justify'>
                            {t('p1-6')}
                        </p>
                        {

                            // result.bazi.year
                            Object.entries(reportDocData.yuezhuData).map(([key, value], index) => {


                                return <div key={index} className={`relative mt-8 flex flex-col  items-center gap-12 lg:gap-0 mx-auto ${index == 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                                    <section className={`${index !== 2 && 'lg:max-w-125'} flex-grow`}>
                                        <p className={`leading-8 text-xl font-bold text-[#073E31]`} style={{ color: wuxingColorMap[key.slice(-1)] }}>
                                            {key}

                                        </p>
                                        <p className='leading-8 text-justify'>
                                            {value}
                                        </p>
                                    </section>
                                    {
                                        index !== 2 && <div className={`relative ${index == 0 ? 'lg:-right-20' : 'lg:-left-20'}`}>
                                            <Image
                                                className='w-105 h-75 object-contain'
                                                priority
                                                src={`/images/report/${key.slice(-1)}.png`}
                                                alt={key}
                                                width={420}
                                                height={320}

                                            />
                                        </div>
                                    }

                                </div>



                            })



                        }
                    </section>
                    {/* 日柱 */}
                    <section className='md:rounded-[26px] rounded-none bg-[#F7FAF9] md:p-10 p-5  md:mt-18 mt-10'>
                        <h2
                            id={`section-0-3`}
                            ref={el => sectionRefs.current[3] = el}
                            className='text-[28px] text-[#073E31] font-bold mb-3'>日柱</h2>
                        <p className='leading-8 text-justify'>
                            {t('p1-7')}
                        </p>
                        {

                            // result.bazi.year
                            Object.entries(reportDocData.rizhuData).map(([key, value], index) => {


                                return <div key={index} className={`relative mt-8 flex flex-col  items-center gap-12 lg:gap-0 mx-auto ${index == 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                                    <section className={`${index !== 2 && 'lg:max-w-125'} flex-grow`}>
                                        <p className={`leading-8 text-xl font-bold text-[#073E31]`} style={{ color: wuxingColorMap[key.slice(-1)] }}>
                                            {key}

                                        </p>
                                        <p className='leading-8 text-justify'>
                                            {value}
                                        </p>
                                    </section>
                                    {
                                        index !== 2 && <div className={`relative ${index == 0 ? 'lg:-right-20' : 'lg:-left-20'}`}>
                                            <Image
                                                className='w-105 h-75 object-contain'
                                                priority
                                                src={`/images/report/${key.slice(-1)}.png`}
                                                alt={key}
                                                width={420}
                                                height={320}

                                            />
                                        </div>
                                    }

                                </div>



                            })



                        }
                    </section>
                    {/* 时柱 */}
                    <section className='md:rounded-[26px] rounded-none bg-[#F7FAF9] md:p-10 p-5 md:mt-18 mt-10'>
                        <h2
                            id={`section-0-4`}
                            ref={el => sectionRefs.current[4] = el}
                            className='text-[28px] text-[#073E31] font-bold mb-3'>{t('shizhu')}</h2>
                        <p className='leading-8 text-justify'>
                            {t('p1-8')}
                        </p>
                        {

                            // result.bazi.year
                            Object.entries(reportDocData.shizhuData).map(([key, value], index) => {


                                return <div key={index} className={`relative mt-8 flex flex-col  items-center gap-12 lg:gap-0 mx-auto ${index == 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'}`}>
                                    <section className={`${index !== 2 && 'lg:max-w-125'} flex-grow`}>
                                        <p className={`leading-8 text-xl font-bold text-[#073E31]`} style={{ color: wuxingColorMap[key.slice(-1)] }}>
                                            {key}

                                        </p>
                                        <p className='leading-8 text-justify'>
                                            {value}
                                        </p>
                                    </section>
                                    {
                                        index !== 2 && <div className={`relative ${index == 0 ? 'lg:-right-20' : 'lg:-left-20'}`}>
                                            <Image
                                                className='w-105 h-75 object-contain'
                                                priority
                                                src={`/images/report/${key.slice(-1)}.png`}
                                                alt={key}
                                                width={420}
                                                height={320}

                                            />
                                        </div>
                                    }

                                </div>



                            })



                        }
                    </section>
                    <div className='md:flex mt-10 items-center px-6 md:p-0'>
                        <p><span className='text-[#FF531A]'>*</span> {t('p1-9')}<span className='font-bold'>{t('p1-10')}</span></p>
                        <UnlockButton className='bg-[#096E56] text-white md:ml-2 w-full md:w-auto mt-5 md:mt-0 block md:inline text-center' />
                    </div>

                </div>
                {/* 第二章 流年运程解析 */}
                <div key='section-1' className="md:max-w-250 mx-auto  md:px-5">
                    <h1
                        ref={el => sectionRefs.current[5] = el}
                        className="md:text-[40px] text-[28px] text-center font-bold md:mt-18 mt-10 mb-10 md:px-0 px-5 text-[#073E31]"
                        id={`section-1`}
                    >
                        {sections[1].title}
                    </h1>
                    <p className='font-bold leading-8 tracking-normal text-justify px-5 md:px-0'>
                        <span className='text-[#073E31]'>{t('p2-1')}</span>{t('p2-2')}
                    </p>

                    {
                        reportDocData.yunchengData.map((item, index) => {
                           
                            return <section
                                style={{ backgroundColor: sections[1].children[index].bgColor, }}
                                className='md:rounded-[26px] rounded-none md:p-8 p-5 md:mt-10 mt-10'>
                                <div className='flex justify-between items-center'>
                                    <p
                                        ref={el => sectionRefs.current[6 + index] = el}
                                        id={`section-1-${index}`}
                                        className={`leading-8 text-xl font-bold flex items-center`}
                                        style={{ color: sections[1].children[index].color }}>

                                        {
                                            index < 5 && <Image src={`/images/report/icon${index}.png`} width={24} height={24} alt='' className='mr-1' />
                                        }
                                        {sections[1].children[index].title}
                                    </p>
                                    {
                                        index < 5 && <p className={`leading-8 flex items-end`} style={{ color: sections[1].children[index].color }}>

                                            <span className='font-bold text-xl'>{item.zhishu?.split('/')[0]}</span>
                                            <span className='text-sm'>/10</span>
                                        </p>
                                    }

                                </div>
                                <p className='leading-8 text-justify'>{item.content}</p>
                            </section>
                        })
                    }
                    <div className='md:flex mt-10 items-center px-6 md:p-0'>
                        <p><span className='text-[#FF531A]'>*</span>{t('p2-3')}<span className='font-bold'>{t('p2-4')}</span></p>
                        <UnlockButton className='bg-[#096E56] text-white md:ml-2 w-full md:w-auto mt-5 md:mt-0 block md:inline text-center' />
                    </div>
                </div>
                {/* 第三章 家居风水解析 */}
                <div key='section-2' className="md:max-w-250 mx-auto  md:px-5">
                    <h1
                        ref={el => sectionRefs.current[12] = el}
                        className="md:text-[40px] text-[28px] text-center font-bold md:mt-18 mt-10 mb-10 md:px-0 px-5 text-[#073E31]"
                        id={`section-2`}
                    >
                        {sections[2].title}
                    </h1>
                    <p className='font-bold leading-8 tracking-normal text-justify px-5 md:px-0'>
                        <span className='text-[#073E31]'>{t('p3-1')}</span>{t('p3-2')}
                        <br />
                        {t('p3-3')}<span className='text-[#073E31]'> {t('p3-4')}</span>{t('p3-5')}
                    </p>

                    <Chapter3 jiajuDataString={JSON.stringify(reportDocData.jiajuData)} isPrinting={isPrinting} />
                </div>

                {/* 第四章 个人命理进阶解析 */}
                <div key='section-3' className="relative md:max-w-250 mx-auto  md:px-5">
                    <h1
                        ref={el => sectionRefs.current[13] = el}
                        className="md:text-[40px] text-[28px] text-center font-bold md:mt-18 mt-10 mb-10 md:px-0 px-5 text-[#073E31]"
                        id={`section-3`}
                    >
                        {sections[3].title}
                    </h1>
                    
                    {
                        isLock && <div className='absolute bg-lock z-10 left-0 top-25 w-full md:h-70 h-60'></div>
                    }
                    <div className={isLock && 'md:h-70 h-60 overflow-hidden'}>
                        <MingLi
                            locale={locale}
                            onSaveData={setMingLiData}
                            userInfo={userInfo}
                            mingLiDataString={JSON.stringify(reportDocData.mingLiData || undefined)}
                            assistantDataString={JSON.stringify(assistantData.mingLiData)}
                            isPrinting={isPrinting} />
                    </div>
                </div>

                {/* 第五章 流年运程进阶解析 */}
                {
                    !isLock && <div key='section-4' >
                        <h1
                            ref={el => sectionRefs.current[14] = el}
                            className="md:text-[40px] text-[28px] text-center font-bold md:mt-18 mt-10 mb-10 md:px-0 px-5 text-[#073E31]"
                            id={`section-4`}
                        >
                            {sections[4]?.title}
                        </h1>
                        <LiuNian locale={locale} onSaveData={setLiuNianData} userInfo={userInfo} liuNianDataString={JSON.stringify(reportDocData.liuNianData || undefined)} assistantDataString={JSON.stringify(assistantData.liuNianData)} isPrinting={isPrinting} />
                    </div>
                }
                {/* 第六章 家居进阶解析 */}
                {
                    // !isLock && <div key='section-5' className="md:max-w-250 mx-auto  md:px-5">
                    //     <h1
                    //         ref={el => sectionRefs.current[15] = el}
                    //         className="md:text-[40px] text-[28px] text-center font-bold md:mt-18 mt-10 mb-10 md:px-0 px-5 text-[#073E31]"
                    //         id={`section-5`}
                    //     >
                    //         {sections[5]?.title}
                    //     </h1>
                    //     <Chapter6 locale={locale} onSaveData={setJiaJuData} userInfo={userInfo} jiajuProDataString={JSON.stringify(reportDocData.jiajuProData || undefined)} assistantDataString={JSON.stringify(assistantData.jiajuProData)} isPrinting={isPrinting} />

                    // </div>
                }

            </div>

        </div>

    );
}
