import { Suspense } from 'react'
import Report from "@/components/Report"
import { Skeleton } from '@/components/ui/skeleton';
export default async function ReportPage({ params, searchParams }) {
    //const zhDataPromise = get(`/api/reportDoc/zh`, { isCached: true })


    const { locale } = await params;
    // const { birthDateTime } = await searchParams;
    return (
        <Report
            //dataPromise={dataPromise}
            //userDataPromise={userDataPromise}
            // birthDateTime={birthDateTime}
            locale={locale}
        />
    )

}

