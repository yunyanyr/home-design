'use client';
import { Link } from '@/i18n/navigation';
import LanguageToggle from './LanguageToggle';
import { Save, UserPen } from 'lucide-react';
import Undo from './canvasComp/Undo';
import useMobile from '../app/hooks/useMobile';
import Avatar from './Avatar';
import { useTranslations } from "next-intl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
export default function NavbarDesign({ onSaveProject, onGenReport, onUserOpen }) {
  const { isMobile } = useMobile();
  const t = useTranslations("design");
  return (
    <nav className="bg-white h-16 border-b-gray-100 border-b-2 fixed top-0 left-0 right-0 z-10">
      <div className="mx-auto px-4 h-full">
        <div className="flex items-center justify-between h-full">
          <Link href="/" className="text-2xl font-bold text-primary">
            HarmoniQ
          </Link>

          <div className="flex items-center space-x-4 text-foreground  gap-3">
            <LanguageToggle className="text-foreground" />
            <span className='flex items-center gap-1 cursor-pointer' onClick={onSaveProject}><Save className="w-4 h-4" />保存 </span>
            <span className='flex items-center gap-1 cursor-pointer' onClick={() => onUserOpen(true)}><UserPen className="w-4 h-4" />{t('profile')} </span>
            <AlertDialog>
              <AlertDialogTrigger className="inline-flex px-4 py-1 bg-button-gradient text-white rounded-full hover:bg-primary/90 transition-colors items-center gap-2" >
                {t("cta")}
                <span className="text-lg">✨</span>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t("alert")}</AlertDialogTitle>
                  {/* <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </AlertDialogDescription> */}
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                  <AlertDialogAction onClick={onGenReport}>{t("ok")}</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Avatar />
          </div>



        </div>
      </div>
    </nav>
  );
}