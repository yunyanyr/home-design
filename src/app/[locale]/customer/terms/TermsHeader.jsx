import React from 'react';
import { useTranslations } from "next-intl";

const TermsHeader = () => {
    const t = useTranslations("home.terms");

    return (
        <div className="text-center mb-10">
            <h1 className="font-lora text-4xl font-bold text-brown">{t('title')}</h1>
            <p className="font-lora text-brown-light max-w-2xl mx-auto mt-4">{t('description')}</p>
        </div>
    );
};

export default TermsHeader;