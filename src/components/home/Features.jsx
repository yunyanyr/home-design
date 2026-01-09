import Image from 'next/image';
import { useTranslations } from "next-intl";


export default function Features() {
  const t = useTranslations("home.features");
  const features = [
    {
      title: t("title1"),
      description: t("subtitle1"),
      icon: "/images/hero/feature1.png"
    },
    {
      title: t("title2"),
      description: t("subtitle2"),
      icon: "/images/hero/feature2.png"
    },
    {
      title: t("title3"),
      description: t("subtitle3"),
      icon: "/images/hero/feature3.png"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto md:px-4 px-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-24 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
            // className="p-6"
            >
              <div className="relative w-13.5 h-13.5 mb-6">
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-hero md:text-2xl text-xl font-bold mb-3">
                {feature.title}
              </h3>
              <p className="text-hero">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 