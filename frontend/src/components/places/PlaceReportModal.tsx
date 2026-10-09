import React, { useState } from 'react';
import { useMapStore } from '../../stores/useMapStore';
import { placesService } from '../../services/placesService';
import { X, AlertTriangle, CheckCircle, Send } from 'lucide-react';

export const PlaceReportModal: React.FC = () => {
  const { isReportModalOpen, reportPlaceId, setReportModal } = useMapStore();
  const [reason, setReason] = useState<'wrong_info' | 'wrong_price' | 'wrong_phone' | 'closed' | 'other'>('wrong_info');
  const [note, setNote] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isReportModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportPlaceId || !note) return;

    setIsSubmitting(true);
    try {
      await placesService.reportPlace({
        placeId: reportPlaceId,
        reason,
        note,
        contactEmail: email || undefined,
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setReportModal(false);
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-red-100 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-red-50/60">
          <div className="flex items-center gap-2 text-red-700 font-extrabold text-base">
            <AlertTriangle className="w-5 h-5" />
            <span>Báo cáo thông tin sai lệch</span>
          </div>
          <button
            onClick={() => setReportModal(false)}
            className="p-1.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="font-extrabold text-gray-900 text-base">Đã gửi báo cáo!</h4>
            <p className="text-xs text-gray-500">
              Cảm ơn đóng góp của bạn để bản đồ Hòa Lạc luôn chính xác cho sinh viên.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm text-gray-700">
            <div>
              <label className="block font-bold text-gray-900 mb-1 text-xs">
                Lý do báo cáo *
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium focus:outline-hidden focus:border-red-500"
              >
                <option value="wrong_price">Sai giá phòng / Giá dịch vụ</option>
                <option value="wrong_phone">Số điện thoại không đúng / không liên lạc được</option>
                <option value="closed">Địa điểm đã đóng cửa / hết phòng vĩnh viễn</option>
                <option value="wrong_info">Sai địa chỉ / Sai vị trí trên bản đồ</option>
                <option value="other">Lý do khác</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-900 mb-1 text-xs">
                Mô tả chi tiết *
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: Phòng này chủ trọ đã tăng giá lên 3.2tr, hoặc SĐT chính xác là 0912..."
                rows={3}
                required
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:outline-hidden focus:border-red-500"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-900 mb-1 text-xs">
                Email / SĐT của bạn (Tùy chọn)
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Để ban quản trị liên hệ xác minh nếu cần"
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs focus:outline-hidden focus:border-red-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setReportModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-red-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Đang gửi...' : 'Gửi phản ánh'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
