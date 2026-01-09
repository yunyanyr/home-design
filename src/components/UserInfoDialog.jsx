'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectLabel,
    SelectGroup,
} from "@/components/ui/select"
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import useMobile from '@/app/hooks/useMobile'
import DateCarousel from "./DateCarousel"
// import DatePicker from "./DatePicker"
import { years, months, days, hours } from './DateCarousel'


export default function UserInfoDialog({ open, onUserOpen, onSubmit, userInfo }) {
    const t = useTranslations('design')
    const isMobile = useMobile()
    const [gender, setGender] = useState('男')
    const [birthYear, setBirthYear] = useState('1996')
    const [birthMonth, setBirthMonth] = useState('03')
    const [birthDay, setBirthDay] = useState('12')
    const [birthHour, setBirthHour] = useState('22')

    // 当接收到用户信息时，更新表单状态
    useEffect(() => {
        if (userInfo) {
            setGender(userInfo.gender || 'male')

            if (userInfo.birthDateTime) {
                const date = new Date(userInfo.birthDateTime)
                setBirthYear(date.getFullYear().toString())
                setBirthMonth((date.getMonth() + 1).toString().padStart(2, '0'))
                setBirthDay(date.getDate().toString().padStart(2, '0'))
                setBirthHour(date.getHours().toString().padStart(2, '0'))
            }
        }
    }, [userInfo])



    const handleSubmit = () => {
        const birthDateTime = new Date(
            parseInt(birthYear),
            parseInt(birthMonth) - 1,
            parseInt(birthDay),
            parseInt(birthHour)
        )

        onSubmit({
            gender,
            birthDateTime
        })
    }

    const onDateChange = value => {
        if (value) {
            setBirthYear(value[0]);
            setBirthMonth(value[1]);
            setBirthDay(value[2]);
            setBirthHour(value[3]);
        }

    }
    const MobileTimeSelector = () => {
        return (
            <div >
                <div className="flex justify-between pb-4">
                    <Label className="text-base">出生日期</Label>
                    <span>{`${birthYear}年${birthMonth}月${birthDay}日${birthHour}${t('hour')}`}</span>

                </div>
                <Separator />
                <DateCarousel tHour={t('hour')} onChange={onDateChange} value={[birthYear, birthMonth, birthDay, birthHour]} />
                {/* <DatePicker onChange={onDateChange} value={[birthYear, birthMonth, birthDay, birthHour]} /> */}
                <Separator />

            </div>

        );
    }

    const DesktopTimeSelector = () => (
        <div className="grid grid-cols-4 gap-4">
            <div>
                <Label className="font-bold pb-4 text-base">年</Label>
                <Select value={birthYear} onValueChange={setBirthYear}>
                    <SelectTrigger className='w-24'>
                        <SelectValue placeholder="年" />
                    </SelectTrigger>
                    <SelectContent>

                        {years.map(year => (
                            <SelectItem key={year} value={year}>
                                {year}年
                            </SelectItem>
                        ))}

                    </SelectContent>
                </Select>
            </div>

            <div><Label className="font-bold pb-4 text-base">月</Label>
                <Select value={birthMonth} onValueChange={setBirthMonth}>
                    <SelectTrigger className='w-24'>
                        <SelectValue placeholder="月" />
                    </SelectTrigger>
                    <SelectContent>
                        {months.map(month => (
                            <SelectItem key={month} value={month}>
                                {month}月
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div><Label className="font-bold pb-4 text-base">日</Label>
                <Select value={birthDay} onValueChange={setBirthDay}>
                    <SelectTrigger className='w-20'>
                        <SelectValue placeholder="日" />
                    </SelectTrigger>
                    <SelectContent>
                        {days.map(day => (
                            <SelectItem key={day} value={day}>
                                {day}日
                            </SelectItem>
                        ))}

                    </SelectContent>

                </Select></div>

            <div><Label className="font-bold pb-4 text-base">小{t('hour')}</Label>
                <Select value={birthHour} onValueChange={setBirthHour}>
                    <SelectTrigger className='w-20' >
                        <SelectValue placeholder={t('hour')} />
                    </SelectTrigger>
                    <SelectContent >
                        {hours.map(hour => (
                            <SelectItem key={hour} value={hour}>
                                {hour}{t('hour')}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select></div>

        </div>
    )
    const GenderDesktop = () => {
        return <div className="space-y-2 pb-4">
            <Label className="font-bold pb-2 text-base">性别</Label>
            <RadioGroup
                value={gender}
                onValueChange={setGender}
                className="flex space-x-4"
            >
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">男</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">女</Label>
                </div>
            </RadioGroup>
        </div>
    }

    const GenderMobile = () => {
        return <div className="flex justify-between">
            <Label className='text-base'>性别</Label>
            <div className="flex bg-gray-200 p-1 rounded-[6px]  ">
                <button

                    style={{
                        boxShadow: "0 1px 5px 0px rgba(0, 0, 0, 0.3)",
                    }}
                    className={`rounded-[6px] px-4 py-1 ${gender === 'male' ? 'bg-white' : 'transparent'}`}
                    onClick={() => setGender('male')}
                >
                    男
                </button>
                <button
                    className={`rounded-[6px] px-4 py-1 ${gender === 'female' ? 'bg-white' : 'transparent'}`}
                    onClick={() => setGender('female')}
                >
                    女
                </button>
            </div>
        </div>
    }
    return (
        <Dialog open={open} onOpenChange={onUserOpen}>
            <DialogContent className="sm:max-w-[432px]">
                <DialogHeader>
                    <DialogTitle className="text-lg md:text-xl font-bold md:text-left text-center"> {t('profile')} </DialogTitle>
                    <div className="py-4 text-sm md:text-base  text-left">
                        {t('tip')}
                    </div>
                </DialogHeader>
                <Separator className='md:hidden' />

                <div className="grid gap-4 pb-4">
                    {isMobile ? <GenderMobile /> : <GenderDesktop />}

                    <Separator className='md:hidden' />
                    {isMobile ? <MobileTimeSelector /> : <DesktopTimeSelector />}

                    {
                        isMobile ? <div className='flex justify-around'>
                            <Button onClick={() => { onUserOpen(false) }} className="px-10 border-1 border-[#ccc] text-foreground rounded-[100px] bg-white font-bold mt-10">
                                取消
                            </Button>
                            <Button onClick={handleSubmit} className="px-10 bg-[#13ab87] font-bold mt-10 rounded-[100px]">
                                保存
                            </Button>
                        </div> :
                            <Button onClick={handleSubmit} className="w-full bg-[#13ab87] font-bold mt-10 rounded-[100px]">
                                保存
                            </Button>
                    }

                </div>
            </DialogContent>
        </Dialog>
    )
} 