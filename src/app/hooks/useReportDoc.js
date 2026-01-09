'use client'
import { useEffect, useState, useRef } from "react";
import { get, post } from "@/lib/ajax";
import _ from 'lodash';
import getWuxingData from '@/lib/nayin';
// 根据userId查询，如果查询到了，拿数据。否则生成随机数后，把结果存储到该userId下。

export default function useReportDoc(locale, userInfo) {
    const renderRef = useRef(true)
    const [loading, setLoading] = useState(true);
    const [reportDocData, setReportDocData] = useState(null);
    const [assistantData, setAssistantData] = useState({});
    // const { data: session } = useSession();

    useEffect(() => {
        console.log('renderRef.current', renderRef.current)
        // if (renderRef.current) {
        //     renderRef.current = false
        //     return
        // }
        const loadDesign = async () => {
            // console.log('loadDesign', session?.user?.userId, locale)
            const userId = userInfo?.userId;
            if (userId && locale) {
                const birthDateTime = userInfo.birthDateTime;
                console.log('查询用户已有报告')
                setLoading(true);

                // const { status, data } = await get(`/api/reportUserDoc/${userId}/${locale == 'zh-CN' ? 'zh' : 'tw'}`)
                // if (status == 0 && data) {
                //     console.log('已有报告')
                //     //找到了用户已有报告
                //     if (userInfo.genStatus == 'done') {
                //         if (!data.mingLiData || !data.liuNianData || !data.jiajuProData) {
                //             //这个用户已经是生成过报告了，但是没有进阶数据，说明上次生成的是另外一种语言，这次需要翻译
                //             //获取另一种语言的进阶数据，作为assistantData传给deepseek接口，来提高两种语言文案的一致程度
                //             const { status, data } = await get(`/api/reportUserDoc/${userId}/${locale == 'zh-CN' ? 'tw' : 'zh'}`)
                //             if (status == 0 && data) {
                //                 setAssistantData(data)
                //             }
                //         }
                //     }
                //     setReportDocData(data);

                // } else {
                    console.log('生成随机报告')
                    //找原始数据集
                    //const { data: zhData } = await get(`/api/reportDoc/zh`, { isCached: true })
                    const { data: twData } = await get(`/api/reportDoc/tw`)
                    // if (zhData && twData) if (zhData && twData)
                    if (twData) {
                        const { nayin, year, month, day: date, hour } = getWuxingData(birthDateTime);
                        const random =0;// Math.floor(Math.random() * 3);
                        const jiajuRandom = 0;//Math.floor(Math.random() * 3);
                        // let zhReportData = {
                        //     nianzhuData: zhData.nianzhuData[year][random],
                        //     yuezhuData: zhData.yuezhuData[month][random],
                        //     rizhuData: zhData.rizhuData[date][random],
                        //     shizhuData: zhData.shizhuData[hour][random],
                        //     yunchengData: zhData.yunchengData[nayin][random],
                        //     jiajuData: getJiajuData(zhData.jiajuData, jiajuRandom)
                        // }
                        let twReportData = {
                            nianzhuData: twData.nianzhuData[year][random],
                            yuezhuData: twData.yuezhuData[month][random],
                            rizhuData: twData.rizhuData[date][random],
                            shizhuData: twData.shizhuData[hour][random],
                            yunchengData: twData.yunchengData[nayin][random],
                            jiajuData: getJiajuData(twData.jiajuData, jiajuRandom)
                        }
                       // const data = locale == 'zh-CN' ? zhReportData : twReportData;
                        setReportDocData(twReportData);
                        //setReportDocData(data);
                        // //存储这个用户生成的免费报告，同时存储简体和繁体。
                        // post(`/api/reportUserDoc/${userId}/zh`, zhReportData);
                        // post(`/api/reportUserDoc/${userId}/tw`, twReportData);
                    }
                //}
                setLoading(false);
            }
        }
        loadDesign();

    }, [locale, userInfo])


    const getJiajuData = (_jiajuData, random) => {
        if (_jiajuData) {
            let jiajuData = _.cloneDeep(_jiajuData);
            for (let key in jiajuData) {
                let room = jiajuData[key];
                for (let direction in room) {
                    room[direction] = room[direction][random]
                }
            }
            return jiajuData;
        }
    }
    return { loading, reportDocData, assistantData };
}
