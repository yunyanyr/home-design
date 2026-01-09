import { NextIntlClientProvider, hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Inter, Lora } from "next/font/google";
import AuthProvider from "@/components/AuthProvider";
import "../globals.css";
import { setRequestLocale } from "next-intl/server";
import { ToastContainer, toast } from "react-toastify";
const lora = Lora({ subsets: ["latin", "symbols"] });

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  console.log("locale", locale);
  return (
    <html lang={locale}>
      <body className={lora.className}>
        <ToastContainer
          position="top-center"
          autoClose={1000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          pauseOnHover
          theme="light"
          className={"text:sm"}
        />
        <AuthProvider>
          <NextIntlClientProvider locale={locale}>
            {children}
          </NextIntlClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
