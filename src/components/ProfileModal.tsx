'use client';

import React from 'react';
import Image from 'next/image';
import { X, Cloud, CheckCircle2, LogOut, BookOpen, Calendar, ShieldCheck, Mail } from 'lucide-react';
import { GoogleIcon } from './Icons';
import { useAuth } from '@/context/AuthContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-[#1c1b1e] border border-slate-200 dark:border-[#2e2c33] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#28272d] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Profile Header */}
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                width={64}
                height={64}
                unoptimized
                className="w-16 h-16 rounded-full object-cover ring-4 ring-slate-100 dark:ring-[#28262e] shadow-sm"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#8A1C1C] text-white flex items-center justify-center text-2xl font-bold ring-4 ring-slate-100 dark:ring-[#28262e] shadow-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-[#1c1b1e] p-1 shadow-xs flex items-center justify-center"
              title={user.provider === 'google' ? 'Google 帳號登入' : '郵箱帳號登入'}
            >
              {user.provider === 'google' ? (
                <GoogleIcon className="w-3.5 h-3.5" />
              ) : (
                <Mail className="w-3.5 h-3.5 text-[#8A1C1C]" />
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">
              {user.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {user.email}
            </p>
            <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>帳號已驗證</span>
            </div>
          </div>
        </div>

        {/* Sync & Learning Stats Bento */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#242228] border border-slate-200/80 dark:border-[#323038] space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#8A1C1C] dark:text-[#f87171]" />
              <span>學習打卡</span>
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              1 <span className="text-xs font-normal text-slate-500">天</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#242228] border border-slate-200/80 dark:border-[#323038] space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
              <span>掌握詞彙</span>
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              128 <span className="text-xs font-normal text-slate-500">詞</span>
            </div>
          </div>
        </div>

        {/* Wordbook Cloud Sync Status */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#242228] border border-slate-200/80 dark:border-[#323038] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Cloud className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  生詞本雲端同步
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  擴展插件與官網雙向同步
                </div>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/40">
              <CheckCircle2 className="w-3 h-3" /> 已連接
            </span>
          </div>
        </div>

        {/* Sign Out Button */}
        <div className="pt-2 border-t border-slate-100 dark:border-[#28272d]">
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full py-2.5 px-4 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/20 hover:bg-red-100/60 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>退出當前帳號 (Sign Out)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
