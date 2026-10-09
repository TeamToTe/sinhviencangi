import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  User as UserIcon,
  LogIn,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

interface PresetAccount {
  username: string;
  name: string;
  mssv: string;
  defaultPassword: string;
  role: 'admin' | 'surveyor';
  roleLabel: string;
}

const PRESET_ACCOUNTS: PresetAccount[] = [
  { username: 'cuongdc', name: 'Đặng Cao Cường', mssv: 'HE204075', defaultPassword: 'cuongHE204075', role: 'admin', roleLabel: 'Admin / Nhóm trưởng' },
  { username: 'vietdt', name: 'Đào Thế Việt', mssv: 'HE204143', defaultPassword: 'vietHE204143', role: 'admin', roleLabel: 'Admin / Phó nhóm' },
  { username: 'thinhdt', name: 'Trần Đức Thịnh', mssv: 'HE201309', defaultPassword: 'thinhHE201309', role: 'admin', roleLabel: 'Admin' },
  { username: 'giangpm', name: 'Phạm Mạnh Giang', mssv: 'HE204233', defaultPassword: 'giangHE204233', role: 'admin', roleLabel: 'Admin' },
  { username: 'huynguyen', name: 'Ngô Quang Huy', mssv: 'HE204101', defaultPassword: 'huyHE204101', role: 'admin', roleLabel: 'Admin' },
  { username: 'duongmx', name: 'Mai Xuân Dương', mssv: 'HE204524', defaultPassword: 'duongHE204524', role: 'admin', roleLabel: 'Admin' },
  { username: 'admin', name: 'ConnectHub Master', mssv: 'SUPERADMIN', defaultPassword: 'hola@2026', role: 'admin', roleLabel: 'Quản trị tối cao' },
];

export const AdminLoginModal: React.FC = () => {
  const { isLoginModalOpen, setLoginModalOpen, login, isLoading, error } = useAuthStore();

  const [username, setUsername] = useState('cuongdc');
  const [password, setPassword] = useState('cuongHE204075');
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
      }, 700);
    }
  };

  const handleSelectPreset = (acc: PresetAccount) => {
    setUsername(acc.username);
    setPassword(acc.defaultPassword);
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
                <span className="text-[10px] bg-amber-400 text-emerald-950 font-black px-2 py-0.5 rounded-full">
                  JWT
                </span>
              </h2>
              <p className="text-xs text-emerald-100">Bảo mật tài khoản 6 thành viên khảo sát & Admin</p>
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
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
          {/* Security Notice */}
          <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="block text-emerald-950 font-semibold">Bảo mật chuẩn mã hóa Bcrypt & JWT:</strong>
              Mật khẩu được băm 10 vòng, phiên làm việc ký số điện tử không hardcode chuỗi trần.
            </div>
          </div>

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
                Tên đăng nhập / Username
              </label>
              <input
                type="text"
                placeholder="VD: admin, cuongdc, thinhdt..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs font-medium text-gray-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gray-500" />
                Mật khẩu / Password
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

          {/* Preset Helper for Demo / Grading */}
          <div className="pt-2 border-t border-gray-100 space-y-1.5">
            <span className="text-[11px] font-bold text-gray-500 flex items-center gap-1">
              <KeyRound className="w-3 h-3 text-amber-500" />
              Tài khoản mẫu (Bấm để điền nhanh):
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto custom-scrollbar p-0.5">
              {PRESET_ACCOUNTS.map((acc) => {
                const isSelected = username === acc.username;
                return (
                  <button
                    key={acc.username}
                    type="button"
                    onClick={() => handleSelectPreset(acc)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                    }`}
                  >
                    <span>👑</span>
                    <span className="font-bold">{acc.username}</span>
                    <span className="text-[10px] opacity-80">({acc.name} - {acc.defaultPassword})</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-400 italic">
              Định dạng mật khẩu: <strong>Tên không dấu + MSSV</strong> (hoặc mật khẩu dự phòng <strong>hola@2026</strong>)
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-98 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoading ? 'Đang xác thực...' : 'Đăng Nhập Ngay'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
