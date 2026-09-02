'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { MessageSquare, Menu, X, User as UserIcon, LogOut, Cloud, ChevronDown, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from './Icons';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/context/AuthContext';

export interface TabItem {
  id: string;
  label: string;
}

export const TABS: TabItem[] = [
  { id: 'home', label: '首頁' },
  { id: 'roadmap', label: '學習導航' },
  { id: 'extension', label: '懸浮擴展' },
];

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  onOpenFeedback: () => void;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenFeedback,
  onOpenAuth,
  onOpenProfile,
}) => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#121214]/95 border-b border-slate-200 dark:border-[#2e2c33] backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Left: Classic Luxury Brand Logo & Typography */}
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 sm:gap-3.5 group cursor-pointer select-none py-1"
        >
          {currentTab !== 'extension' ? (
            <>
              {/* Pure Transparent Bauhinia Flower Logo */}
              <Image
                src="/logo-flower.svg"
                alt="Bauhinia Flower Logo"
                width={54}
                height={54}
                className="w-[48px] h-[48px] sm:w-[52px] sm:h-[52px] shrink-0 transition-transform duration-300 ease-out group-hover:scale-105"
              />

              {/* Brand Typography */}
              <div className="flex items-center gap-2">
                {/* Large JYUT in Cinzel Serif */}
                <span
                  style={{ fontFamily: 'var(--font-cinzel), "Times New Roman", serif' }}
                  className="font-bold text-3xl sm:text-[34px] tracking-wide text-slate-900 dark:text-white leading-none"
                >
                  JYUT
                </span>

                {/* Right: Stacked .HK on top and 粵語學習空間 on bottom */}
                <div className="flex flex-col justify-center">
                  <span
                    style={{ fontFamily: 'var(--font-cinzel), "Times New Roman", serif' }}
                    className="font-bold text-sm sm:text-[15px] text-amber-500 dark:text-amber-400 leading-none tracking-wider"
                  >
                    .HK
                  </span>
                  <span className="text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 font-medium leading-none tracking-tight whitespace-nowrap pt-1.5">
                    粵語學習空間
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3.5">
              <Image
                src="/logo-extension.svg"
                alt="Jyutping Extension Logo"
                width={46}
                height={46}
                className="w-[42px] h-[42px] sm:w-[46px] sm:h-[46px] shrink-0 drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="font-bold text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white leading-none">
                  粵語懸浮詞典
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono tracking-wider pt-1">
                  Jyutping Hover Dictionary
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 dark:bg-[#1c1b1e] p-1.5 rounded-full border border-slate-200/80 dark:border-[#2e2c33]">
          {TABS.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-white font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-[#252429]'
                }`}
                style={
                  isActive
                    ? {
                        background: 'linear-gradient(135deg, #8A1C1C 0%, #B42929 100%)',
                      }
                    : undefined
                }
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="hidden md:flex items-center gap-2">
          {/* Feedback Trigger */}
          <button
            onClick={onOpenFeedback}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-[#1e1d21] transition-colors cursor-pointer"
            title="意見與反饋"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          {/* Light / Dark Mode Toggle */}
          <ThemeToggle />

          {/* GitHub Repo */}
          <a
            href="https://github.com/Ousinki/jyutping-extension"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-[#1e1d21] transition-colors"
            title="GitHub 原始碼"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          {/* User Auth: Avatar Only */}
          {user ? (
            <button
              onClick={onOpenProfile}
              className="relative p-0.5 rounded-full ring-2 ring-slate-200 dark:ring-[#38363e] hover:ring-[#8A1C1C] dark:hover:ring-[#f87171] transition-all cursor-pointer shadow-xs active:scale-95 ml-1 group"
              title={`我的學習空間 (${user.name})`}
            >
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={30}
                  height={30}
                  unoptimized
                  className="w-[30px] h-[30px] rounded-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="w-[30px] h-[30px] rounded-full bg-[#8A1C1C] text-white flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-105">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white rounded-lg bg-[#8A1C1C] hover:bg-[#B42929] shadow-sm active:scale-95 transition-all cursor-pointer ml-1"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>登入 / 註冊</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-1.5">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-[#1e1d21]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-[#1c1b1e] border-b border-slate-200 dark:border-[#2e2c33] px-4 py-4 space-y-2 shadow-lg animate-fadeIn">
          {TABS.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onSelectTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full px-3 py-2 text-sm font-medium rounded-lg text-left transition-colors ${
                  isActive
                    ? 'bg-[#fdf2f2] dark:bg-[#271616] text-[#8A1C1C] dark:text-[#f87171] font-bold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#252429]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-200 dark:border-[#2e2c33] flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenFeedback();
              }}
              className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1 py-1"
            >
              <MessageSquare className="w-3.5 h-3.5" /> 意見反饋
            </button>

            {user ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProfile();
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#252429] text-slate-800 dark:text-slate-200 text-xs font-semibold cursor-pointer"
              >
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={22}
                    height={22}
                    unoptimized
                    className="w-[22px] h-[22px] rounded-full object-cover"
                  />
                ) : (
                  <div className="w-[22px] h-[22px] rounded-full bg-[#8A1C1C] text-white flex items-center justify-center text-[10px] font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span>我的</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#8A1C1C] text-white"
              >
                登入 / 註冊
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
