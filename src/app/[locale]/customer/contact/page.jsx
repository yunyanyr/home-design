import { useTranslations } from "next-intl";
import EnquiryForm from "./EnquiryForm";

export default function () {
    const t = useTranslations("home.contact");
    return <div className="py-10 bg-secondary min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-10">
                <h1 className="font-lora text-4xl font-bold text-brown">{t('title')}</h1>
                <p className="font-lora text-brown-light max-w-2xl mx-auto mt-4">{t('content')}</p>
            </div>
            <EnquiryForm />

        </div>
    </div>
}