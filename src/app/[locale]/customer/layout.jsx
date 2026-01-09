import Navbar from '@/components/Navbar';
import Footer from '@/components/home/Footer';
export default async function LocaleLayout({
    children,
    params,
}) {
    return <>
        <Navbar />
        {children}
        <Footer />
    </>


}