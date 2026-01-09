"use client";
import React, { useState } from "react";
import { Send, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { AntdSpin } from "antd-spin";
import { post } from "@/lib/ajax";
import { toast } from "react-toastify";
// 示例使用：在某个API路由或页面组件中调用sendEmail函数
const labelMap = {
  "name": "姓名",
  "email": "邮箱",
  "category": "类别",
  "otherCategory": "其他类别",
  "message": "留言内容",
}
const EnquiryForm = () => {
  const t = useTranslations("home.contact");
  const t2 = useTranslations("toast");
  let arr = Array.from(new Array(5));
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    otherCategory: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
    //
    let arr = Object.entries(formData).map(([key, value]) => {
      return `<p>${labelMap[key]}:${value}</p>`
    })
    let body = { content: `<div>${arr.join("")}</div>` }
    setLoading(true);
    try {
      const res = await post("/api/sendEmail", body);
      if (res.data) {
        toast.success("发送成功，" + t2("loading"));
        setLoading(false);
        setFormData({
          name: "",
          email: "",
          category: "",
          otherCategory: "",
          message: "",
        })
        router.push("/");
      } else {
        toast.error("发送失败");
        setLoading(false);
      }
    } catch (e) {
      toast.error("发送失败" + e.message);
      setLoading(false);
      console.log('submit error', e)
    }


  };

  const handleInputChange = (
    e
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (

    <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm">
      <AntdSpin fullscreen={true} spinning={loading} tip={t2('loading2')} className='bg-[#fff9]' />
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block font-lora text-sm font-medium text-brown mb-2"
          >
            {t("name.label")}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder={t("name.placeholder")}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block font-lora text-sm font-medium text-brown mb-2"
          >
            {t("email.label")}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder={t("email.placeholder")}
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block font-lora text-sm font-medium text-brown mb-2"
          >
            {t("category.label")}
          </label>
          <div className="relative">
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary appearance-none"
            >
              <option value="">{t("category.placeholder")}</option>
              {arr.map((i, index) => (
                <option key={index} value={t(`category.option${index + 1}`)}>
                  {t(`category.option${index + 1}`)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {formData.category === "Other" && (
          <div>
            <input
              type="text"
              name="otherCategory"
              value={formData.otherCategory}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder={t("category.otherPlaceholder")}
            />
          </div>
        )}

        <div>
          <label
            htmlFor="message"
            className="block font-lora text-sm font-medium text-brown mb-2"
          >
            {t("message.label")}
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-primary resize-none"
            placeholder={t("message.placeholder")}
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2"
        >
          <Send className="w-5 h-5" />
          {t("submit")}
        </button>
      </form>
    </div>
  );
};

export default EnquiryForm;
