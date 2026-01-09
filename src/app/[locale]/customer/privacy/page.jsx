import { useTranslations } from "next-intl";
export default function () {
    const t = useTranslations("home.privacy");
    let arr = Array.from(new Array(4));
    return <div className="py-10 bg-secondary min-h-screen">
        <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-10">
                <h1 className="font-lora text-4xl font-bold text-brown">{t('title')}</h1>
                <p className="font-lora text-brown-light max-w-2xl mx-auto mt-4">{t('description')}</p>
            </div>
            <div className="space-y-6">
                {arr.map((section, index) => (
                    <section key={index} className="bg-white rounded-xl p-6 sm:p-8 shadow-sm">
                        <h2 className="font-lora text-xl font-semibold text-brown mb-4">{t(`block${index + 1}.title`)}</h2>
                        <div className="space-y-4">
                            <p className="font-lora text-brown-light whitespace-pre-wrap">
                                {t(`block${index + 1}.content`)}
                            </p>
                        </div>
                    </section>
                ))}
            </div>
        </div>

    </div>
}