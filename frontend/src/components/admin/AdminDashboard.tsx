import React, { useState, useEffect, useRef } from 'react';
import {
  Activity,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  Edit3,
  Trash2,
  Check,
  Eye,
  ArrowLeft,
  ExternalLink,
  ShieldCheck,
  Camera,
} from 'lucide-react';
import type { Place, ReportItem, PlaceCategory, SurveyStats } from '../../types/place';
import { placesService } from '../../services/placesService';
import { useMapStore } from '../../stores/useMapStore';
import { useAuthStore } from '../../stores/useAuthStore';
import { uploadReviewImage, validateImageFile } from '../../services/storageService';
import { resolveImageUrl } from '../../utils/imageUrl';
import { formatPriceText, getCategoryUnit } from '../../utils/priceUtils';

// Stable colour palette for the real-data breakdown bars
const BAR_COLORS = [
  'bg-emerald-500',
  'bg-blue-500',
  'bg-amber-500',
  'bg-violet-500',
  'bg-indigo-500',
  'bg-rose-500',
  'bg-cyan-500',
  'bg-purple-500',
  'bg-teal-500',
  'bg-orange-500',
];

// Vietnamese labels for the category slugs stored in the database
const CATEGORY_LABELS: Record<string, string> = {
  boarding_house: 'Nhà trọ & CCMN',
  food_drink: 'Ăn uống & Cafe',
  grocery: 'Siêu thị & Tạp hóa',
  pharmacy: 'Hiệu thuốc & Y tế',
  services: 'Sửa xe & Dịch vụ',
  entertainment: 'Giải trí & Thể thao',
  campus: 'Trường & Điểm đón Bus',
};

interface AdminDashboardProps {
  places: Place[];
  onPlaceUpdated?: (updated: Place) => void;
  onPlaceDeleted?: (id: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  places,
  onPlaceUpdated,
  onPlaceDeleted,
}) => {
  const { setActiveTab, setSurveyStep, flyToPlace } = useMapStore();
  const { user, isAdmin } = useAuthStore();

  const [activeAdminSection, setActiveAdminSection] = useState<'traffic' | 'places' | 'submissions' | 'reports'>('traffic');

  // Reports state
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [reportFilter, setReportFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [resolvingReportId, setResolvingReportId] = useState<string | null>(null);
  const [adminResolveNote, setAdminResolveNote] = useState<string>('');
  const [submissions, setSubmissions] = useState<Place[]>([]);
  const [reviewingSubmissionId, setReviewingSubmissionId] = useState<string | null>(null);

  // Real survey statistics (from GET /api/stats)
  const [stats, setStats] = useState<SurveyStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Places search & management
  const [placeSearch, setPlaceSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);

  // Quick form for manual place creation
  const [isManualCreateOpen, setIsManualCreateOpen] = useState(false);
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceCategory, setNewPlaceCategory] = useState<PlaceCategory>('boarding_house');
  const [newPlaceAddress, setNewPlaceAddress] = useState('');
  const [newPlaceArea, setNewPlaceArea] = useState('Tân Xã');
  const [newPlaceLat, setNewPlaceLat] = useState('21.0185');
  const [newPlaceLng, setNewPlaceLng] = useState('105.5345');
  const [newPlacePrice, setNewPlacePrice] = useState('2500000');
  const [newPlacePhone, setNewPlacePhone] = useState('');

  const returnToMap = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
    setActiveTab('map');
  };

  // Load reports
  const loadReports = async () => {
    try {
      const data = await placesService.getReports();
      setReports(data);
    } catch (err) {
      console.error('Failed to load reports:', err);
    }
  };

  const loadSubmissions = async () => {
    try {
      const data = await placesService.getPlaceSubmissions();
      setSubmissions(data);
    } catch (err) {
      console.error('Failed to load guest submissions:', err);
    }
  };

  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const data = await placesService.getSurveyStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load survey stats:', err);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
    loadSubmissions();
    loadStats();
  }, []);

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    if (reportFilter === 'all') return true;
    return r.status === reportFilter;
  });

  const pendingReportsCount = reports.filter((r) => r.status === 'pending').length;
  const resolvedReportsCount = reports.filter((r) => r.status === 'resolved').length;

  const handleReviewSubmission = async (place: Place, approvalStatus: 'approved' | 'rejected') => {
    setReviewingSubmissionId(place.id);
    try {
      const updated = await placesService.reviewPlaceSubmission(place.id, approvalStatus);
      if (approvalStatus === 'approved' && onPlaceUpdated) onPlaceUpdated(updated);
      await loadSubmissions();
    } catch (err) {
      console.error('Failed to review guest submission:', err);
    } finally {
      setReviewingSubmissionId(null);
    }
  };

  // Filtered places
  const filteredPlaces = places.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(placeSearch.toLowerCase()) ||
      p.address.toLowerCase().includes(placeSearch.toLowerCase()) ||
      p.areaName.toLowerCase().includes(placeSearch.toLowerCase());
    const matchCat = selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter;
    return matchSearch && matchCat;
  });

  // Handle Mark as Resolved
  const handleMarkResolved = async (reportId: string) => {
    try {
      await placesService.updateReportStatus(
        reportId,
        'resolved',
        adminResolveNote.trim() || 'Đã kiểm tra và cập nhật thông tin chính xác.'
      );
      setResolvingReportId(null);
      setAdminResolveNote('');
      await loadReports();
    } catch (err) {
      console.error('Failed to resolve report:', err);
    }
  };

  // Handle Quick Toggle Room Status
  const handleToggleRoomStatus = async (place: Place) => {
    const newStatus = !place.isAvailable;
    try {
      const updated = await placesService.updatePlace(place.id, {
        isAvailable: newStatus,
        badgeText: newStatus ? 'Còn phòng' : 'Hết phòng',
      });
      if (onPlaceUpdated) onPlaceUpdated(updated);
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  // Handle Delete Place
  const handleDeletePlace = async (place: Place) => {
    if (!window.confirm(`Xác nhận xóa địa điểm "${place.name}" khỏi hệ thống?`)) return;
    try {
      await placesService.deletePlace(place.id);
      if (onPlaceDeleted) onPlaceDeleted(place.id);
    } catch (err) {
      console.error('Failed to delete place:', err);
    }
  };

  // Admin Change Cover Photo in Edit Modal
  const adminEditCoverInputRef = useRef<HTMLInputElement>(null);
  const [isAdminUploadingCover, setIsAdminUploadingCover] = useState(false);

  const handleAdminChangeCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPlace) return;

    const check = validateImageFile(file);
    if (!check.valid) {
      alert(check.error);
      if (adminEditCoverInputRef.current) adminEditCoverInputRef.current.value = '';
      return;
    }

    setIsAdminUploadingCover(true);
    try {
      const uploadRes = await uploadReviewImage(file, editingPlace.id, 'reviews');
      const updatedPhotos = [uploadRes.url, ...(editingPlace.photos?.length > 1 ? editingPlace.photos.slice(1) : [])];
      setEditingPlace({
        ...editingPlace,
        photos: updatedPhotos,
      });
      alert('Đã tải ảnh bìa mới thành công! Hãy bấm "Lưu thay đổi" để áp dụng.');
    } catch (err: any) {
      alert(`Lỗi tải ảnh: ${err.message || 'Không thể upload'}`);
    } finally {
      setIsAdminUploadingCover(false);
      if (adminEditCoverInputRef.current) adminEditCoverInputRef.current.value = '';
    }
  };

  // Handle Edit Place Save
  const handleSaveEditPlace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlace) return;
    try {
      const updated = await placesService.updatePlace(editingPlace.id, editingPlace);
      if (onPlaceUpdated) onPlaceUpdated(updated);
      setEditingPlace(null);
      alert('Đã cập nhật thông tin địa điểm thành công!');
    } catch (err) {
      console.error('Failed to update place:', err);
    }
  };

  // Handle Manual Create Place
  const handleManualCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaceName) return;

    try {
      const created = await placesService.createPlace({
        name: newPlaceName,
        category: newPlaceCategory,
        address: newPlaceAddress || `${newPlaceArea}, Thạch Thất, Hà Nội`,
        areaName: newPlaceArea,
        area: newPlaceArea,
        coordinates: {
          lat: parseFloat(newPlaceLat) || 21.0185,
          lng: parseFloat(newPlaceLng) || 105.5345,
        },
        rentPrice: parseInt(newPlacePrice, 10) || 0,
        phone: newPlacePhone,
        contributorName: user?.fullName || 'Admin',
      });

      if (onPlaceUpdated) onPlaceUpdated(created);
      setIsManualCreateOpen(false);
      setNewPlaceName('');
      setNewPlacePhone('');
      alert(`Đã thêm địa điểm "${created.name}" thành công!`);
    } catch (err) {
      console.error('Failed to create place:', err);
    }
  };

  // Derived values for the "Thống kê dữ liệu" tab — all computed from real /api/stats data
  const areaEntries = stats ? Object.entries(stats.byArea).sort((a, b) => b[1] - a[1]) : [];
  const areaTotal = areaEntries.reduce((sum, [, count]) => sum + count, 0);
  const categoryEntries = stats ? Object.entries(stats.byCategory).sort((a, b) => b[1] - a[1]) : [];
  const categoryTotal = categoryEntries.reduce((sum, [, count]) => sum + count, 0);
  const surveyorEntries = stats ? [...stats.bySurveyor].sort((a, b) => b.count - a.count) : [];
  const maxSurveyor = Math.max(1, ...surveyorEntries.map((s) => s.count));

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-slate-50 custom-scrollbar font-serif">
      {/* Top Admin Header Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={returnToMap}
              className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-extrabold shrink-0 shadow-xs"
              title="Quay lại bản đồ"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-700" />
              <span>Quay lại bản đồ</span>
            </button>
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Trang Quản Trị Hệ Thống HolaMap
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  {isAdmin ? 'Quản trị viên' : 'Khảo sát'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal">
                Xin chào, <strong className="text-slate-800">{user?.fullName || 'Admin'}</strong> • Thống kê dữ liệu, thêm địa điểm & xử lý báo cáo
              </p>
            </div>
          </div>

          {/* Navigation Pills between 3 Admin modules */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 overflow-x-auto shrink-0">
            <button
              onClick={() => setActiveAdminSection('traffic')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeAdminSection === 'traffic'
                  ? 'bg-white text-emerald-800 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>Thống kê dữ liệu</span>
            </button>

            <button
              onClick={() => setActiveAdminSection('places')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeAdminSection === 'places'
                  ? 'bg-white text-emerald-800 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Chấm & Quản lý điểm ({places.length})</span>
            </button>

            <button
              onClick={() => setActiveAdminSection('reports')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap relative ${
                activeAdminSection === 'reports'
                  ? 'bg-white text-emerald-800 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Báo cáo sai lệch</span>
              {pendingReportsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">
                  {pendingReportsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveAdminSection('submissions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap relative ${
                activeAdminSection === 'submissions'
                  ? 'bg-white text-emerald-800 shadow-xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-violet-600" />
              <span>Đề xuất chờ duyệt</span>
              {submissions.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-violet-600 text-white text-[9px] font-black flex items-center justify-center">
                  {submissions.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-8 space-y-6">
        {/* ========================================================================= */}
        {/* MODULE 1: KIỂM SOÁT LƯU LƯỢNG (TRAFFIC & ANALYTICS)                        */}
        {/* ========================================================================= */}
        {activeAdminSection === 'traffic' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* 4 Stat Cards — real data from GET /api/stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng địa điểm</p>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">
                    {statsLoading ? '…' : (stats?.totalPlaces ?? 0)}
                  </p>
                  <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <span>Tiến độ khảo sát {stats?.progressPercentage ?? 0}%</span>
                    <span className="text-slate-400">/ mục tiêu {stats?.targetPlaces ?? 0}</span>
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng đánh giá</p>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">
                    {statsLoading ? '…' : (stats?.totalReviews ?? 0)}
                  </p>
                  <p className="text-xs font-semibold text-blue-600 flex items-center gap-1">
                    <span>Đánh giá thực từ người dùng</span>
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Activity className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Người đóng góp</p>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">
                    {statsLoading ? '…' : (stats?.totalContributors ?? 0)}
                  </p>
                  <p className="text-xs font-semibold text-violet-600 flex items-center gap-1">
                    <span>Thành viên đã đóng góp dữ liệu</span>
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Chờ xử lý</p>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">
                    {submissions.length + pendingReportsCount}
                  </p>
                  <p className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                    <span>{submissions.length} đề xuất</span>
                    <span className="text-slate-400">{pendingReportsCount} báo cáo</span>
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Survey Progress (real) */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">Tiến độ khảo sát địa điểm</h3>
                  <p className="text-xs text-slate-500">
                    Số địa điểm đã duyệt trên tổng mục tiêu {stats?.targetPlaces ?? 0} điểm
                  </p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  {stats?.totalPlaces ?? 0} / {stats?.targetPlaces ?? 0}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, stats?.progressPercentage ?? 0)}%` }}
                />
              </div>
            </div>

            {/* Contributions per surveyor (real: bySurveyor) */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">Đóng góp theo thành viên khảo sát</h3>
                  <p className="text-xs text-slate-500">Số địa điểm đã duyệt do từng thành viên đóng góp</p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                  Dữ liệu thực
                </span>
              </div>

              {surveyorEntries.length === 0 ? (
                <p className="text-sm text-slate-400 py-6 text-center">Chưa có dữ liệu đóng góp.</p>
              ) : (
                <div className="flex gap-1.5 sm:gap-2 items-end h-40 pt-6 px-2 border-b border-slate-100 overflow-x-auto">
                  {surveyorEntries.map((s, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5 h-full justify-end group min-w-[44px] flex-1">
                      <span className="text-[10px] font-bold text-slate-500 group-hover:text-emerald-700 transition-colors whitespace-nowrap">
                        {s.count}
                      </span>
                      <div
                        style={{ height: `${Math.max(4, Math.round((s.count / maxSurveyor) * 100))}%` }}
                        className="w-full rounded-t-lg transition-all duration-300 group-hover:scale-y-105 bg-gradient-to-t from-emerald-600 to-lime-400 shadow-sm"
                      />
                      <span className="text-[10px] text-slate-500 font-semibold truncate max-w-[64px] text-center" title={s.name}>
                        {s.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Regional & Category Breakdown (real: byArea / byCategory) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Regional Breakdown */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-black text-slate-900">Phân bổ địa điểm theo khu vực</h3>
                {areaEntries.length === 0 ? (
                  <p className="text-sm text-slate-400 py-6 text-center">Chưa có dữ liệu khu vực.</p>
                ) : (
                  <div className="space-y-3">
                    {areaEntries.map(([name, count], idx) => {
                      const percent = areaTotal > 0 ? Math.round((count / areaTotal) * 1000) / 10 : 0;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-slate-700">
                            <span>{name}</span>
                            <span>{count} điểm • {percent}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${BAR_COLORS[idx % BAR_COLORS.length]}`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Category Breakdown */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-black text-slate-900">Phân bổ địa điểm theo loại hình dịch vụ</h3>
                {categoryEntries.length === 0 ? (
                  <p className="text-sm text-slate-400 py-6 text-center">Chưa có dữ liệu danh mục.</p>
                ) : (
                  <div className="space-y-3">
                    {categoryEntries.map(([name, count], idx) => {
                      const percent = categoryTotal > 0 ? Math.round((count / categoryTotal) * 1000) / 10 : 0;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs font-bold text-slate-700">
                            <span>{CATEGORY_LABELS[name] || name}</span>
                            <span>{count} điểm • {percent}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${BAR_COLORS[idx % BAR_COLORS.length]}`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 2: CHẤM THÊM ĐIỂM & QUẢN LÝ ĐỊA ĐIỂM                               */}
        {/* ========================================================================= */}
        {activeAdminSection === 'places' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSurveyStep('map_pin')}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                  title="Chấm điểm thực địa trực tiếp trên bản đồ"
                >
                  <MapPin className="w-4 h-4 text-amber-300" />
                  <span>+ Chấm Điểm Trên Bản Đồ GPS</span>
                </button>

                <button
                  onClick={() => setIsManualCreateOpen(true)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black transition-all cursor-pointer border border-slate-200"
                >
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span>Thêm Thủ Công</span>
                </button>
              </div>

              {/* Search & Category Filter */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    maxLength={100}
                    placeholder="Tìm tên, địa chỉ, trọ..."
                    value={placeSearch}
                    onChange={(e) => setPlaceSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-hidden"
                >
                  <option value="all">Tất cả loại hình</option>
                  <option value="boarding_house">Nhà trọ & CCMN</option>
                  <option value="food_drink">Ăn uống & Cafe</option>
                  <option value="services">Sửa xe & Dịch vụ</option>
                  <option value="pharmacy">Hiệu thuốc</option>
                  <option value="grocery">Siêu thị & Tạp hóa</option>
                  <option value="entertainment">Giải trí</option>
                </select>
              </div>
            </div>

            {/* Places Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">Danh sách địa điểm ({filteredPlaces.length})</h3>
                  <p className="text-xs text-slate-500">Chỉnh sửa thông tin, giá phòng, đổi trạng thái Còn/Hết phòng tức thì</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                      <th className="py-3 px-4">Địa điểm</th>
                      <th className="py-3 px-4">Khu vực</th>
                      <th className="py-3 px-4">Giá dịch vụ / phòng</th>
                      <th className="py-3 px-4">Số điện thoại</th>
                      <th className="py-3 px-4 text-center">Trạng thái phòng</th>
                      <th className="py-3 px-4 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPlaces.map((place) => (
                      <tr key={place.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={place.photos[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=100'}
                              alt={place.name}
                              className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200"
                            />
                            <div>
                              <p className="font-bold text-slate-900">{place.name}</p>
                              <p className="text-[11px] text-slate-500 truncate max-w-xs">{place.address}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[11px]">
                            {place.areaName}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-bold text-slate-900">
                          {place.priceInfo ? (
                            <span>{formatPriceText(place.priceInfo, place.category)}</span>
                          ) : (
                            <span className="text-slate-400 font-normal">Chưa cập nhật</span>
                          )}
                        </td>

                        <td className="py-3 px-4 font-semibold text-slate-700">
                          {place.phone || <span className="text-slate-400 font-normal">Chưa có SĐT</span>}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleToggleRoomStatus(place)}
                            className={`px-3 py-1 rounded-xl text-[11px] font-bold cursor-pointer transition-all shadow-2xs ${
                              place.isAvailable
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            }`}
                            title="Bấm để chuyển đổi Còn phòng / Hết phòng"
                          >
                            {place.isAvailable ? '✓ Còn phòng' : '✕ Hết phòng'}
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                flyToPlace(place);
                                returnToMap();
                              }}
                              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                              title="Xem vị trí trên bản đồ"
                            >
                              <Eye className="w-4 h-4 text-emerald-600" />
                            </button>

                            <button
                              onClick={() => setEditingPlace(place)}
                              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                              title="Sửa thông tin"
                            >
                              <Edit3 className="w-4 h-4 text-blue-600" />
                            </button>

                            <button
                              onClick={() => handleDeletePlace(place)}
                              className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                              title="Xóa địa điểm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 3: DUYỆT ĐỀ XUẤT ĐỊA ĐIỂM TỪ GUEST                                */}
        {/* ========================================================================= */}
        {activeAdminSection === 'submissions' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-violet-200 shadow-xs">
              <div>
                <h3 className="text-base font-black text-slate-900">Đề xuất địa điểm từ khách</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Các đề xuất này chưa xuất hiện trên bản đồ. Duyệt để công khai, hoặc từ chối để giữ chúng ẩn.
                </p>
              </div>
              <span className="self-start sm:self-auto px-3 py-1.5 rounded-xl bg-violet-100 text-violet-800 text-xs font-black">
                {submissions.length} chờ duyệt
              </span>
            </div>

            {submissions.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-black text-slate-800 text-sm">Không có đề xuất nào chờ duyệt</h4>
                <p className="text-xs text-slate-400">Các đề xuất mới từ guest sẽ xuất hiện tại đây.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {submissions.map((place) => (
                  <article key={place.id} className="bg-white rounded-3xl border border-violet-200 shadow-xs overflow-hidden">
                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="font-black text-slate-900 text-base truncate">{place.name}</h4>
                          <p className="text-xs text-slate-500 mt-1">{place.categoryLabel} · {place.areaName}</p>
                        </div>
                        <span className="shrink-0 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-black">Chờ duyệt</span>
                      </div>

                      {place.photos[0] && (
                        <img src={place.photos[0]} alt={place.name} className="w-full h-36 object-cover rounded-2xl border border-slate-100" />
                      )}

                      <div className="text-xs text-slate-700 space-y-1.5 bg-slate-50 rounded-2xl p-3.5">
                        <p><strong>Địa chỉ:</strong> {place.address}</p>
                        <p><strong>Tọa độ:</strong> {place.coordinates.lat.toFixed(5)}, {place.coordinates.lng.toFixed(5)}</p>
                        {place.phone && <p><strong>Liên hệ:</strong> {place.phone}</p>}
                        {place.reviews[0]?.comment && <p><strong>Nhận xét:</strong> {place.reviews[0].comment}</p>}
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleReviewSubmission(place, 'approved')}
                          disabled={reviewingSubmissionId === place.id}
                          className="flex-1 px-3 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Check className="w-4 h-4" /> Duyệt & công khai
                        </button>
                        <button
                          onClick={() => handleReviewSubmission(place, 'rejected')}
                          disabled={reviewingSubmissionId === place.id}
                          className="px-3 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-black transition-colors disabled:opacity-50 cursor-pointer"
                        >
                          Từ chối
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODULE 4: KIỂM SOÁT BÁO CÁO SAI LỆCH (REPORTS & MARK AS RESOLVED)          */}
        {/* ========================================================================= */}
        {activeAdminSection === 'reports' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Summary & Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <div>
                <h3 className="text-base font-black text-slate-900">Báo cáo sai lệch từ người dùng & sinh viên</h3>
                <p className="text-xs text-slate-500">
                  Kiểm tra các phản hồi sai giá, sai SĐT, quán đóng cửa. Sau khi kiểm tra hoặc sửa thông tin, bấm <strong>Mark as Resolved</strong>.
                </p>
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 shrink-0">
                <button
                  onClick={() => setReportFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    reportFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tất cả ({reports.length})
                </button>
                <button
                  onClick={() => setReportFilter('pending')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    reportFilter === 'pending'
                      ? 'bg-red-500 text-white shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Chờ xử lý</span>
                  <span className="w-4 h-4 rounded-full bg-white text-red-600 text-[10px] font-black flex items-center justify-center">
                    {pendingReportsCount}
                  </span>
                </button>
                <button
                  onClick={() => setReportFilter('resolved')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    reportFilter === 'resolved'
                      ? 'bg-emerald-600 text-white shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Đã giải quyết ({resolvedReportsCount})
                </button>
              </div>
            </div>

            {/* Reports List */}
            {filteredReports.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="font-black text-slate-800 text-sm">Không có báo cáo nào</h4>
                <p className="text-xs text-slate-400">Tất cả thông tin địa điểm đang hoạt động chính xác!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredReports.map((report) => {
                  const targetPlace = places.find((p) => p.id === report.placeId);

                  return (
                    <div
                      key={report.id}
                      className={`p-5 rounded-3xl border transition-all bg-white shadow-xs space-y-3 ${
                        report.status === 'pending'
                          ? 'border-amber-200 ring-1 ring-amber-100'
                          : 'border-slate-200 opacity-90'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold ${
                              report.reason === 'wrong_price'
                                ? 'bg-amber-100 text-amber-800'
                                : report.reason === 'wrong_phone'
                                ? 'bg-blue-100 text-blue-800'
                                : report.reason === 'closed'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            ⚠️ {report.reasonLabel || report.reason}
                          </span>

                          <h4 className="font-black text-slate-900 text-sm">
                            {report.placeName || targetPlace?.name || `Địa điểm #${report.placeId}`}
                          </h4>

                          {targetPlace && (
                            <span className="text-[11px] text-slate-500 font-semibold">
                              ({targetPlace.areaName})
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            {report.createdAt}
                          </span>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              report.status === 'resolved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {report.status === 'resolved' ? '✓ Đã giải quyết' : '● Chờ xử lý'}
                          </span>
                        </div>
                      </div>

                      {/* Content Description */}
                      <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 text-xs text-slate-700 leading-relaxed font-medium">
                        <strong className="text-slate-900 block mb-1">Nội dung phản ánh của người dùng:</strong>
                        "{report.note}"
                        {report.contactEmail && (
                          <span className="block mt-1 text-[11px] text-slate-500 font-normal">
                            Liên hệ người gửi: <span className="font-semibold text-slate-700">{report.contactEmail}</span>
                          </span>
                        )}
                      </div>

                      {/* If Resolved, show Admin Note */}
                      {report.status === 'resolved' && (
                        <div className="bg-emerald-50/70 p-3 rounded-2xl border border-emerald-200 text-xs text-emerald-900">
                          <span className="font-bold">Ghi chú xử lý ({report.resolvedAt || 'Đã sửa'}):</span>{' '}
                          {report.adminNote || 'Đã xác minh và cập nhật thông tin chính xác.'}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <div className="flex items-center gap-2">
                          {targetPlace && (
                            <button
                              onClick={() => setEditingPlace(targetPlace)}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border border-slate-200"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                              <span>Sửa địa điểm ngay</span>
                            </button>
                          )}

                          {targetPlace && (
                            <button
                              onClick={() => {
                                flyToPlace(targetPlace);
                                returnToMap();
                              }}
                              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 border border-slate-200"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Xem trên bản đồ</span>
                            </button>
                          )}
                        </div>

                        {report.status === 'pending' && (
                          <div>
                            {resolvingReportId === report.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  placeholder="Ghi chú xử lý (VD: Đã cập nhật giá mới 2.8tr)"
                                  maxLength={300}
                                  value={adminResolveNote}
                                  onChange={(e) => setAdminResolveNote(e.target.value)}
                                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-300 text-xs focus:outline-hidden w-64"
                                />
                                <button
                                  onClick={() => handleMarkResolved(report.id)}
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Xác nhận</span>
                                </button>
                                <button
                                  onClick={() => setResolvingReportId(null)}
                                  className="px-2 py-1.5 rounded-xl bg-slate-200 text-slate-600 text-xs font-bold cursor-pointer"
                                >
                                  Hủy
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setResolvingReportId(report.id)}
                                className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                <CheckCircle2 className="w-4 h-4 text-lime-300" />
                                <span>Mark as Resolved (Đã Xử Lý)</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: EDIT PLACE MODAL                                                 */}
      {/* ========================================================================= */}
      {editingPlace && (
        <div className="fixed inset-0 z-[12000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-sm">Chỉnh sửa địa điểm</h3>
              </div>
              <button
                onClick={() => setEditingPlace(null)}
                className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditPlace} className="p-6 space-y-4 overflow-y-auto text-xs">
              {/* Cover Photo UI */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Ảnh bìa địa điểm</label>
                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-20 h-16 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 relative shadow-2xs">
                    <img
                      src={resolveImageUrl(editingPlace.photos?.[0])}
                      alt={editingPlace.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <input
                      ref={adminEditCoverInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,image/avif"
                      className="hidden"
                      onChange={handleAdminChangeCover}
                    />
                    <button
                      type="button"
                      onClick={() => adminEditCoverInputRef.current?.click()}
                      disabled={isAdminUploadingCover}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center gap-1.5 border border-slate-300 shadow-2xs cursor-pointer transition-colors disabled:opacity-60"
                    >
                      <Camera className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isAdminUploadingCover ? 'Đang tải lên...' : 'Tải ảnh bìa mới'}</span>
                    </button>
                    <span className="text-[10px] text-slate-500 block">Tối đa 5MB • Tự động nén WebP siêu nhẹ</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên địa điểm *</label>
                <input
                  type="text"
                  maxLength={120}
                  value={editingPlace.name}
                  onChange={(e) => setEditingPlace({ ...editingPlace, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-900 focus:outline-hidden focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Khu vực *</label>
                  <input
                    type="text"
                    maxLength={100}
                    value={editingPlace.areaName}
                    onChange={(e) => setEditingPlace({ ...editingPlace, areaName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    maxLength={30}
                    value={editingPlace.phone || ''}
                    onChange={(e) => setEditingPlace({ ...editingPlace, phone: e.target.value })}
                    placeholder="0912..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Địa chỉ chi tiết</label>
                <input
                  type="text"
                  maxLength={250}
                  value={editingPlace.address}
                  onChange={(e) => setEditingPlace({ ...editingPlace, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giá hiển thị (VNĐ)</label>
                  <input
                    type="number"
                    value={editingPlace.priceInfo?.amount || 0}
                    onChange={(e) =>
                      setEditingPlace({
                        ...editingPlace,
                        priceInfo: editingPlace.priceInfo
                          ? { ...editingPlace.priceInfo, amount: parseInt(e.target.value, 10) || 0 }
                          : { amount: parseInt(e.target.value, 10) || 0, unit: getCategoryUnit(editingPlace.category) },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Trạng thái phòng</label>
                  <select
                    value={editingPlace.isAvailable ? 'available' : 'full'}
                    onChange={(e) =>
                      setEditingPlace({
                        ...editingPlace,
                        isAvailable: e.target.value === 'available',
                        badgeText: e.target.value === 'available' ? 'Còn phòng' : 'Hết phòng',
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden font-bold"
                  >
                    <option value="available">Còn phòng</option>
                    <option value="full">Hết phòng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả tóm tắt</label>
                <textarea
                  value={editingPlace.shortDescription}
                  maxLength={300}
                  onChange={(e) => setEditingPlace({ ...editingPlace, shortDescription: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPlace(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-xs"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: MANUAL CREATE PLACE MODAL                                        */}
      {/* ========================================================================= */}
      {isManualCreateOpen && (
        <div className="fixed inset-0 z-[12000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-sm">Thêm địa điểm thủ công</h3>
              </div>
              <button
                onClick={() => setIsManualCreateOpen(false)}
                className="p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualCreate} className="p-6 space-y-4 overflow-y-auto text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên địa điểm *</label>
                <input
                  type="text"
                  placeholder="VD: Nhà Trọ An Bình 2 Tân Xã"
                  maxLength={120}
                  value={newPlaceName}
                  onChange={(e) => setNewPlaceName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-bold focus:outline-hidden focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Danh mục *</label>
                  <select
                    value={newPlaceCategory}
                    onChange={(e) => setNewPlaceCategory(e.target.value as PlaceCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-hidden"
                  >
                    <option value="boarding_house">Nhà trọ & CCMN</option>
                    <option value="food_drink">Ăn uống & Cafe</option>
                    <option value="services">Sửa xe & Dịch vụ</option>
                    <option value="pharmacy">Hiệu thuốc & Y tế</option>
                    <option value="grocery">Siêu thị & Tạp hóa</option>
                    <option value="entertainment">Giải trí</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Khu vực *</label>
                  <select
                    value={newPlaceArea}
                    onChange={(e) => setNewPlaceArea(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-hidden"
                  >
                    <option value="Tân Xã">Tân Xã</option>
                    <option value="Thạch Hòa">Thạch Hòa</option>
                    <option value="Bình Yên">Bình Yên</option>
                    <option value="Khu Công Nghệ Cao Hòa Lạc">Khu CNC Hòa Lạc</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Địa chỉ chi tiết</label>
                <input
                  type="text"
                  placeholder="Đường Tân Xã, Thạch Thất, Hà Nội"
                  maxLength={250}
                  value={newPlaceAddress}
                  onChange={(e) => setNewPlaceAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Giá tham khảo (VNĐ)</label>
                  <input
                    type="number"
                    placeholder="2500000"
                    value={newPlacePrice}
                    onChange={(e) => setNewPlacePrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    placeholder="0912345678"
                    maxLength={30}
                    value={newPlacePhone}
                    onChange={(e) => setNewPlacePhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Vĩ độ (Lat)</label>
                  <input
                    type="text"
                    maxLength={20}
                    value={newPlaceLat}
                    onChange={(e) => setNewPlaceLat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kinh độ (Lng)</label>
                  <input
                    type="text"
                    maxLength={20}
                    value={newPlaceLng}
                    onChange={(e) => setNewPlaceLng(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsManualCreateOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-xs"
                >
                  Tạo địa điểm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
