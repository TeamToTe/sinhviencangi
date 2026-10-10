import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  User as UserIcon,
  LogIn,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';
import { useMapStore } from '../../stores/useMapStore';

export const AdminLoginModal: React.FC = () => {
  const { isLoginModalOpen, setLoginModalOpen, login, isLoading, error } = useAuthStore();
  const { setActiveTab } = useMapStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    const ok = await login(username.trim(), password.trim());
    if (ok) {
      setSuccessMsg('Đăng nhập thành công! Đang chuyển hướng...');
      setTimeout(() => {
        setSuccessMsg('');
        setLoginModalOpen(false);
        setActiveTab('admin');
      }, 500);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={() => setLoginModalOpen(false)}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl border border-emerald-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg tracking-tight font-serif flex items-center gap-1.5">
                <span>Đăng Nhập Quản Trị</span>
              </h2>
              <p className="text-xs text-emerald-100">Khu vực dành riêng cho Quản trị viên & Khảo sát</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLoginModalOpen(false)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 font-serif">
          {/* Success Banner */}
          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 text-xs font-medium flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Input Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5 text-gray-500" />
                Tên đăng nhập
              </label>
              <input
                type="text"
                placeholder="Nhập tên đăng nhập của bạn..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs font-medium text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gray-500" />
                Mật khẩu
              </label>
              <input
                type="password"
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs font-medium text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-98 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoading ? 'Đang xác thực...' : 'Đăng Nhập'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
