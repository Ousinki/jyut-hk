'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, CheckCircle2, User, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { GoogleIcon } from './Icons';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithEmail, registerWithEmail, loginWithGoogle } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loadingType, setLoadingType] = useState<'idle' | 'email' | 'google'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setErrorMsg('');
    setLoadingType('idle');
    setIsSuccess(false);
    setSuccessMsg('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (mode === 'forgot') {
      if (!email.includes('@')) {
        setErrorMsg('請輸入有效的電子郵件地址');
        return;
      }
      setLoadingType('email');
      setTimeout(() => {
        setLoadingType('idle');
        setIsSuccess(true);
        setSuccessMsg(`重置密碼鏈接已發送至 ${email}，請查收！`);
        setTimeout(() => {
          handleClose();
        }, 2500);
      }, 800);
      return;
    }

    setLoadingType('email');
    const action = mode === 'login' ? loginWithEmail : registerWithEmail;
    const res = await action(email, password);

    setLoadingType('idle');
    if (res.success) {
      setIsSuccess(true);
      setSuccessMsg(mode === 'login' ? '登入成功！正在進入學習空間...' : '註冊成功！歡迎加入 jyut.hk！');
      setTimeout(() => {
        handleClose();
      }, 1200);
    } else {
      setErrorMsg(res.error || '操作失敗，請稍後重試');
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setLoadingType('google');
    const res = await loginWithGoogle();
    setLoadingType('idle');

    if (res.success) {
      setIsSuccess(true);
      setSuccessMsg('Google 授權成功！歡迎回來！');
      setTimeout(() => {
        handleClose();
      }, 1200);
    } else {
      setErrorMsg(res.error || 'Google 授權失敗，請檢查網絡');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-[#1c1b1e] border border-slate-200 dark:border-[#2e2c33] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#28272d] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#8A1C1C] dark:text-[#f87171] flex items-center justify-center mx-auto mb-2 shadow-xs">
            <User className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            {mode === 'login' && '登入 jyut.hk 粵語學堂'}
            {mode === 'register' && '註冊新學員帳號'}
            {mode === 'forgot' && '找回密碼'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {mode === 'forgot'
              ? '輸入註冊郵箱，我們將向您發送密碼重置指引'
              : '解鎖名師視頻課程、雲端同步生詞本與學習打卡進度'}
          </p>
        </div>

        {/* Success Alert */}
        {isSuccess ? (
          <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-center space-y-2 animate-fadeIn">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400 mx-auto" />
            <div className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
              {successMsg}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Google Quick Login Button (Top Tier) */}
            {mode !== 'forgot' && (
              <>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loadingType !== 'idle'}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-300 dark:border-[#38363e] bg-white dark:bg-[#181719] hover:bg-slate-50 dark:hover:bg-[#242227] text-slate-800 dark:text-slate-200 text-sm font-semibold flex items-center justify-center gap-2.5 shadow-2xs hover:shadow-xs transition-all active:scale-[0.98] cursor-pointer disabled:opacity-60"
                >
                  {loadingType === 'google' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                      <span>正在連接 Google 授權...</span>
                    </>
                  ) : (
                    <>
                      <GoogleIcon className="w-4 h-4" />
                      <span>使用 Google 帳號快速登入</span>
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-4">
                  <div className="border-t border-slate-200 dark:border-[#2e2c33] w-full" />
                  <span className="bg-white dark:bg-[#1c1b1e] px-3 text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider shrink-0">
                    或者使用電子郵件
                  </span>
                  <div className="border-t border-slate-200 dark:border-[#2e2c33] w-full" />
                </div>
              </>
            )}

            {/* Error Message Banner */}
            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center gap-2 text-xs text-red-700 dark:text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Email Form */}
            <form onSubmit={handleEmailSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  電子郵件 (Email)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#181719] border border-slate-300 dark:border-[#333138] text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8A1C1C]/30 focus:border-[#8A1C1C]"
                  />
                </div>
              </div>

              {mode !== 'forgot' && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      密碼 (Password)
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMsg('');
                          setMode('forgot');
                        }}
                        className="text-[11px] text-slate-500 hover:text-[#8A1C1C] dark:hover:text-[#f87171] transition-colors cursor-pointer"
                      >
                        忘記密碼？
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-[#181719] border border-slate-300 dark:border-[#333138] text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8A1C1C]/30 focus:border-[#8A1C1C]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loadingType !== 'idle'}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-[#8A1C1C] hover:bg-[#B42929] shadow-sm active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 mt-1"
              >
                {loadingType === 'email' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>處理中...</span>
                  </>
                ) : (
                  <span>
                    {mode === 'login' && '立即登入'}
                    {mode === 'register' && '完成註冊'}
                    {mode === 'forgot' && '發送重置鏈接'}
                  </span>
                )}
              </button>

              {/* Toggle Mode Footer */}
              <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
                {mode === 'login' && (
                  <span>
                    還沒有帳號？{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMsg('');
                        setMode('register');
                      }}
                      className="text-[#8A1C1C] dark:text-[#f87171] font-semibold hover:underline cursor-pointer"
                    >
                      立即免費註冊
                    </button>
                  </span>
                )}
                {mode === 'register' && (
                  <span>
                    已有學員帳號？{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMsg('');
                        setMode('login');
                      }}
                      className="text-[#8A1C1C] dark:text-[#f87171] font-semibold hover:underline cursor-pointer"
                    >
                      返回直接登入
                    </button>
                  </span>
                )}
                {mode === 'forgot' && (
                  <span>
                    想起密碼了？{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMsg('');
                        setMode('login');
                      }}
                      className="text-[#8A1C1C] dark:text-[#f87171] font-semibold hover:underline cursor-pointer"
                    >
                      返回登入
                    </button>
                  </span>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
