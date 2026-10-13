import { createApp } from '../src/app.js';
import { runMigrations } from '../src/db/migrate.js';
import { db } from '../src/db/index.js';
import { config } from '../src/config.js';
import jwt from 'jsonwebtoken';
import http from 'http';

async function testBackend() {
  console.log('🧪 Starting Backend API Automated Tests...\n');

  // 1. Setup DB
  await runMigrations();

  // 2. Start temporary test server
  const app = createApp();
  const testPort = 8089;
  const server = app.listen(testPort);

  const baseUrl = `http://127.0.0.1:${testPort}`;

  async function apiFetch(path: string, options: RequestInit = {}) {
    const res = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers as any),
      },
    });
    const data = await res.json();
    return { status: res.status, ok: res.ok, data };
  }

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string) {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
    }
  }

  try {
    // Test 1: Healthcheck
    const health = await apiFetch('/api/health');
    assert(health.status === 200 && health.data.status === 'ok', 'GET /api/health returns 200 and ok');

    // Test 2: Categories
    const categories = await apiFetch('/api/categories');
    assert(
      categories.status === 200 && Array.isArray(categories.data) && categories.data.length >= 7,
      'GET /api/categories returns >= 7 categories'
    );

    // Test 3: Places List
    const places = await apiFetch('/api/places');
    assert(
      places.status === 200 && Array.isArray(places.data) && places.data.length > 0,
      `GET /api/places returns list of places (found ${places.data.length})`
    );

    const firstPlace = places.data[0];

    // Test 4: Place Details
    const detail = await apiFetch(`/api/places/${firstPlace.id}`);
    assert(
      detail.status === 200 && detail.data.name === firstPlace.name,
      `GET /api/places/${firstPlace.id} returns place details`
    );

    // Test 5: Guest map submission is created as pending, never public immediately.
    const pinPayload = {
      name: 'Quán Trà Sữa Đóm Đóm - Tân Xã',
      category: 'food_drink',
      coordinates: {
        lat: 21.0195,
        lng: 105.5350,
      },
      address: 'Số 9 ngõ 2 Tân Xã, Thạch Thất, Hà Nội',
      areaName: 'Tân Xã',
      priceInfo: {
        amount: 30000,
        unit: 'ly',
      },
      phone: '0988112233',
      openingHours: '08:00 - 23:00',
      amenities: ['Có điều hòa', 'Wifi miễn phí', 'Thanh toán QR', 'View hồ Tân Xã'],
      photos: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80'],
      contributorName: 'Đặng Cao Cường',
      approvalStatus: 'approved', // Must be ignored for a guest request.
      rating: 5,
      reviewContent: 'Chấm vào bản đồ test: Quán trà sữa mới view hồ, đồ uống ngon giá sinh viên!',
    };

    const pinnedPlace = await apiFetch('/api/places', {
      method: 'POST',
      body: JSON.stringify(pinPayload),
    });

    assert(
      pinnedPlace.status === 201 &&
        pinnedPlace.data.name === pinPayload.name &&
        pinnedPlace.data.coordinates.lat === pinPayload.coordinates.lat &&
        pinnedPlace.data.approvalStatus === 'pending',
      'POST /api/places creates a guest proposal with pending approval status'
    );

    const submittedPlaceId = pinnedPlace.data.id;

    const unauthenticatedQueue = await apiFetch('/api/places/submissions');
    assert(
      unauthenticatedQueue.status === 401,
      'GET /api/places/submissions rejects unauthenticated users'
    );

    // Test 6: Pending proposal is hidden from public nearby search.
    const nearby = await apiFetch(
      `/api/places/nearby?lat=${pinPayload.coordinates.lat}&lng=${pinPayload.coordinates.lng}&radius=500`
    );
    assert(
      nearby.status === 200 &&
        Array.isArray(nearby.data) &&
        !nearby.data.some((p: any) => p.id === submittedPlaceId),
      'GET /api/places/nearby hides pending guest proposals'
    );

    // Test 7: Pending proposals cannot be loaded through the public detail API.
    const pendingDetail = await apiFetch(`/api/places/${submittedPlaceId}`);
    assert(
      pendingDetail.status === 404,
      'GET /api/places/:id hides pending guest proposals'
    );

    // Test 8: Add Review with images (POST /api/places/:id/reviews)
    const reviewRes = await apiFetch(`/api/places/${firstPlace.id}/reviews`, {
      method: 'POST',
      body: JSON.stringify({
        placeId: firstPlace.id,
        authorName: 'Đào Thế Việt',
        studentBatch: 'K18 FPTU',
        rating: 5,
        comment: 'Đã ghé thử quán theo chấm trên bản đồ, trà hoa quả siêu ngon!',
        images: ['https://example.com/test-review-image.webp'],
      }),
    });
    assert(
      reviewRes.status === 201 &&
        reviewRes.data.authorName === 'Đào Thế Việt' &&
        Array.isArray(reviewRes.data.images) &&
        reviewRes.data.images[0] === 'https://example.com/test-review-image.webp',
      'POST /api/places/:id/reviews successfully adds a student review with images'
    );

    // Test 8b: Guardrail rejects invalid image format (POST /api/places/:id/reviews)
    const invalidImageRes = await apiFetch(`/api/places/${firstPlace.id}/reviews`, {
      method: 'POST',
      body: JSON.stringify({
        placeId: firstPlace.id,
        authorName: 'Đào Thế Việt',
        studentBatch: 'K18 FPTU',
        rating: 5,
        comment: 'Thử gửi file không phải ảnh',
        images: ['data:application/pdf;base64,JVBERi0xLjQK...'],
      }),
    });
    assert(
      invalidImageRes.status === 400,
      'POST /api/places/:id/reviews guardrail rejects non-image payload'
    );

    // Test 9: Submit Report (POST /api/reports)
    const reportRes = await apiFetch('/api/reports', {
      method: 'POST',
      body: JSON.stringify({
        placeId: firstPlace.id,
        reason: 'wrong_info',
        note: 'Quán đổi giờ mở cửa từ 09:00',
        contactEmail: 'cuong@fpt.edu.vn',
      }),
    });
    assert(
      reportRes.status === 200 && reportRes.data.success === true,
      'POST /api/reports successfully records inaccurate data report'
    );

    // Test 10: Filter places by category
    const foodPlaces = await apiFetch('/api/places?category=food_drink');
    assert(
      foodPlaces.status === 200 &&
        foodPlaces.data.every((p: any) => p.category === 'food_drink'),
      'GET /api/places?category=food_drink filters accurately'
    );

    // Test 11: Contributors with KPI tracking
    const contribs = await apiFetch('/api/contributions');
    assert(
      contribs.status === 200 &&
        contribs.data.some((c: any) => c.name === 'Đặng Cao Cường' && c.placeCount !== undefined),
      'GET /api/contributions returns survey contributors with KPI place count'
    );

    // Test 12: Survey Template
    const template = await apiFetch('/api/places/template');
    assert(
      template.status === 200 &&
        Array.isArray(template.data.surveyors) &&
        template.data.surveyors.length >= 6 &&
        Array.isArray(template.data.commonAmenities),
      'GET /api/places/template returns full 14-question survey options from Read_me.txt'
    );

    // Test 13: Detect Area from GPS
    const areaDetect = await apiFetch('/api/places/detect-area', {
      method: 'POST',
      body: JSON.stringify({ lat: 21.0185, lng: 105.5345 }),
    });
    assert(
      areaDetect.status === 200 && areaDetect.data.area === 'Tân Xã',
      'POST /api/places/detect-area auto-detects "Tân Xã" from GPS coordinates'
    );

    // Test 14: Image Upload (Base64)
    const uploadRes = await apiFetch('/api/upload', {
      method: 'POST',
      body: JSON.stringify({
        data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        name: 'test_pin.png',
      }),
    });
    assert(
      uploadRes.status === 201 && uploadRes.data.url.startsWith('data:image/png;base64,'),
      'POST /api/upload keeps base64 photos in durable database-compatible form'
    );

    // Test 15: Overall Survey Stats & Dashboard
    const statsRes = await apiFetch('/api/stats');
    assert(
      statsRes.status === 200 &&
        statsRes.data.totalPlaces > 0 &&
        statsRes.data.targetPlaces === 50 &&
        statsRes.data.byCategory &&
        statsRes.data.bySurveyor,
      'GET /api/stats returns progress towards 50-places field survey goal'
    );

    // Test 16: Auth - Admin Login (POST /api/auth/login)
    const adminLoginRes = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'admin',
        password: 'hola@2026',
      }),
    });
    assert(
      adminLoginRes.status === 200 &&
        adminLoginRes.data.token &&
        adminLoginRes.data.user.role === 'admin' &&
        adminLoginRes.data.user.username === 'admin',
      'POST /api/auth/login succeeds for master admin with valid JWT token'
    );
    const adminToken = adminLoginRes.data.token;

    // Test 17: Auth - Member Admin Login with name+MSSV password
    const memberLoginRes = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'thinhdt',
        password: 'thinhHE201309',
      }),
    });
    assert(
      memberLoginRes.status === 200 &&
        memberLoginRes.data.token &&
        memberLoginRes.data.user.role === 'admin' &&
        memberLoginRes.data.user.fullName === 'Trần Đức Thịnh',
      'POST /api/auth/login succeeds for member admin with name+MSSV password'
    );

    // Test 17b: Auth - Alias username & case-insensitive password login
    const aliasLoginRes = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'cuong',
        password: 'cuonghe204075',
      }),
    });
    assert(
      aliasLoginRes.status === 200 &&
        aliasLoginRes.data.user.role === 'admin' &&
        aliasLoginRes.data.user.username === 'cuongdc',
      'POST /api/auth/login succeeds for alias username "cuong" and lowercase password'
    );

    // Test 18: Auth - Invalid Credentials rejected
    const badLoginRes = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'admin',
        password: 'wrong_password_123',
      }),
    });
    assert(
      badLoginRes.status === 401 && badLoginRes.data.error,
      'POST /api/auth/login rejects incorrect password with 401'
    );

    // Test 19: Auth - GET /api/auth/me with Bearer token
    const meRes = await apiFetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    assert(
      meRes.status === 200 && meRes.data.username === 'admin',
      'GET /api/auth/me returns authenticated user from JWT'
    );

    // Test 20: RBAC - Admin can list all 7 seeded users
    const usersRes = await apiFetch('/api/auth/users', {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    assert(
      usersRes.status === 200 && Array.isArray(usersRes.data) && usersRes.data.length >= 7,
      'GET /api/auth/users (admin only) returns all seeded team accounts'
    );

    // Test 21: RBAC - Non-admin surveyor token is forbidden from listing all users
    const nonAdminToken = jwt.sign(
      { userId: 999, username: 'testuser', fullName: 'Test Guest', role: 'surveyor' },
      config.jwtSecret,
      { expiresIn: '1h' }
    );
    const forbiddenRes = await apiFetch('/api/auth/users', {
      headers: {
        Authorization: `Bearer ${nonAdminToken}`,
      },
    });
    assert(
      forbiddenRes.status === 403,
      'GET /api/auth/users rejects non-admin token with 403 Forbidden'
    );

    // Test 22: Admin can review the pending proposal.
    const submissionsRes = await apiFetch('/api/places/submissions', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(
      submissionsRes.status === 200 && submissionsRes.data.some((p: any) => p.id === submittedPlaceId),
      'GET /api/places/submissions shows pending proposals to an admin only'
    );

    const approvalRes = await apiFetch(`/api/places/${submittedPlaceId}/approval`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ approvalStatus: 'approved' }),
    });
    assert(
      approvalRes.status === 200 && approvalRes.data.approvalStatus === 'approved',
      'PATCH /api/places/:id/approval publishes a pending proposal'
    );

    const approvedDetail = await apiFetch(`/api/places/${submittedPlaceId}`);
    assert(
      approvedDetail.status === 200 && approvedDetail.data.id === submittedPlaceId,
      'Approved proposal becomes visible through the public place API'
    );

    // Test 23: Admin Reports Management
    const unauthReportsRes = await apiFetch('/api/reports');
    assert(
      unauthReportsRes.status === 401,
      'GET /api/reports rejects unauthenticated request with 401'
    );

    const adminReportsRes = await apiFetch('/api/reports', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert(
      adminReportsRes.status === 200 && Array.isArray(adminReportsRes.data) && adminReportsRes.data.length > 0,
      'GET /api/reports returns list of reported issues to authenticated Admin'
    );
    const targetReport = adminReportsRes.data[0];

    const patchReportRes = await apiFetch(`/api/reports/${targetReport.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({ status: 'resolved', adminNote: 'Đã xác minh và cập nhật.' }),
    });
    assert(
      patchReportRes.status === 200 && patchReportRes.data.success === true,
      'PATCH /api/reports/:id marks report as resolved by Admin'
    );

    // Test 23a: Protected Cover Update - unauthenticated request rejected
    const unauthCoverRes = await apiFetch(`/api/places/${submittedPlaceId}/cover`, {
      method: 'PATCH',
      body: JSON.stringify({ coverUrl: 'https://example.com/new-cover.webp' }),
    });
    assert(
      unauthCoverRes.status === 401,
      'PATCH /api/places/:id/cover rejects unauthenticated request with 401'
    );

    // Test 23b: Protected Cover Update - Admin updates cover photo successfully
    const adminCoverRes = await apiFetch(`/api/places/${submittedPlaceId}/cover`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ coverUrl: 'https://example.com/new-cover.webp' }),
    });
    assert(
      adminCoverRes.status === 200 &&
        adminCoverRes.data.photos &&
        adminCoverRes.data.photos[0] === 'https://example.com/new-cover.webp',
      'PATCH /api/places/:id/cover updates place cover photo successfully'
    );

    // Test 24: Protected Deletion - unauthenticated request rejected
    const unauthDeleteRes = await apiFetch(`/api/places/${submittedPlaceId}`, {
      method: 'DELETE',
    });
    assert(
      unauthDeleteRes.status === 401,
      'DELETE /api/places/:id rejects unauthenticated request with 401'
    );

    // Test 25: Protected Deletion - Admin deletes place successfully
    const adminDeleteRes = await apiFetch(`/api/places/${submittedPlaceId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    assert(
      adminDeleteRes.status === 200 && adminDeleteRes.data.success === true,
      'DELETE /api/places/:id succeeds when called by authenticated Admin'
    );

  } catch (err: any) {
    console.error('Test execution error:', err);
  } finally {
    server.close();
    await db.close();
  }

  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed.`);
  if (passedTests === totalTests) {
    console.log('🎉 ALL BACKEND TESTS PASSED!\n');
  } else {
    process.exit(1);
  }
}

testBackend();
