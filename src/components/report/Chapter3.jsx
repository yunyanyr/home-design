"use client";
import _ from "lodash";
import {
    useState,

    useEffect,

} from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import UnlockButton from '../UnlockButton';
import RoomCanvas from "./RoomCanvas";
export default function ({ jiajuDataString, isPrinting }) {
    const t = useTranslations('report');
    const [activeRoom, setActiveRoom] = useState(null); // 当前激活的房间
    const [roomList, setRoomList] = useState([]); // 所有房间列表

    const jiajuData = JSON.parse(jiajuDataString);
    const fetchRoomList = roomList => {
        setRoomList(roomList);
    }
    return <section>
        <RoomCanvas activeRoom={activeRoom} setActiveRoom={setActiveRoom} onChangeRoomList={fetchRoomList} />
        {
            activeRoom && !isPrinting && <div className="w-full md:rounded-b-3xl bg-[#fafafa] md:p-8 p-5 border-1 border-[#E6E6E6]">
                <div className="flex items-center gap-2">
                    <Image
                        width={activeRoom?.data._type === 'dining_room' ? 28 : 32}
                        height={activeRoom?.data._type === 'dining_room' ? 28 : 32}
                        style={{ color: 'red' }}
                        alt=""
                        src={`/images/report/${activeRoom?.data._type}.svg`} />
                    <h2 className="text-xl font-bold">
                        {activeRoom?.data.label}
                    </h2>
                </div>
                <div className="mt-3">
                    {
                        jiajuData && jiajuData[activeRoom?.data._type] ?
                        Object.entries(jiajuData[activeRoom?.data._type][activeRoom?.direction]).map(([key, value]) => {
                            return <p className="leading-8 flex" > <span className="font-bold whitespace-nowrap min-w-22.5">{key}：</span>
                                <span className="whitespace-pre-wrap">{value} </span>
                            </p>
                        }):  Object.entries(jiajuData.bedroom[activeRoom?.direction]).map(([key, value]) => {
                            return <p className="leading-8 flex" > <span className="font-bold whitespace-nowrap min-w-22.5">{key}：</span>
                                <span className="whitespace-pre-wrap">{value} </span>
                            </p>})
                    }
                </div>


            </div>
        }

        {/* 在页面上隐藏，打印时展示 */}
        {
            isPrinting && <div className="w-full md:rounded-b-3xl bg-[#fafafa] md:p-8 p-5 border-1 border-[#E6E6E6]">
                <div className="mt-3">
                    {
                        roomList.map((room, i) => (
                            <>
                                <h2 className="text-xl font-bold text-[#073E31]">
                                    {room.data.label}
                                </h2>
                                {jiajuData && jiajuData[room.data._type] &&
                                    Object.entries(jiajuData[room.data._type][room.direction]).map(([key, value]) => {
                                        return <p className="leading-8 flex" > <span className="font-bold whitespace-nowrap min-w-22.5">{key}：</span>
                                            <span className="whitespace-pre-wrap">{value} </span>
                                        </p>
                                    })}
                            </>



                        ))

                    }

                </div>
            </div>
        }

        <div className='md:flex mt-10 items-center px-6 md:p-0'>
            <p><span className='text-[#FF531A]'>*</span>{t('p3-6')}<span className='font-bold'>{t('p3-7')}</span></p>
            <UnlockButton className='bg-[#096E56] text-white md:ml-2 w-full md:w-auto mt-5 md:mt-0 block md:inline text-center' />
        </div>
    </section>
}