import { createApp } from '../src/app.js';
import { runMigrations } from '../src/db/migrate.js';
import { db } from '../src/db/index.js';
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

    // Test 5: "Chấm vào bản đồ" - Map Pinning (POST /api/places)
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
        pinnedPlace.data.coordinates.lat === pinPayload.coordinates.lat,
      'POST /api/places ("Chấm vào bản đồ") successfully creates new pinned place with coordinates'
    );

    const newPlaceId = pinnedPlace.data.id;

    // Test 6: Nearby places (spatial search for "Chấm vào bản đồ")
    const nearby = await apiFetch(
      `/api/places/nearby?lat=${pinPayload.coordinates.lat}&lng=${pinPayload.coordinates.lng}&radius=500`
    );
    assert(
      nearby.status === 200 &&
        Array.isArray(nearby.data) &&
        nearby.data.some((p: any) => p.id === newPlaceId),
      'GET /api/places/nearby locates the newly pinned spot within 500m radius'
    );

    // Test 7: Add Review (POST /api/places/:id/reviews)
    const reviewRes = await apiFetch(`/api/places/${newPlaceId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({
        placeId: newPlaceId,
        authorName: 'Đào Thế Việt',
        studentBatch: 'K18 FPTU',
        rating: 5,
        comment: 'Đã ghé thử quán theo chấm trên bản đồ, trà hoa quả siêu ngon!',
      }),
    });
    assert(
      reviewRes.status === 201 && reviewRes.data.authorName === 'Đào Thế Việt',
      'POST /api/places/:id/reviews successfully adds a student review'
    );

    // Test 8: Submit Report (POST /api/reports)
    const reportRes = await apiFetch('/api/reports', {
      method: 'POST',
      body: JSON.stringify({
        placeId: newPlaceId,
        reason: 'wrong_info',
        note: 'Quán đổi giờ mở cửa từ 09:00',
        contactEmail: 'cuong@fpt.edu.vn',
      }),
    });
    assert(
      reportRes.status === 200 && reportRes.data.success === true,
      'POST /api/reports successfully records inaccurate data report'
    );

    // Test 9: Filter places by category
    const foodPlaces = await apiFetch('/api/places?category=food_drink');
    assert(
      foodPlaces.status === 200 &&
        foodPlaces.data.every((p: any) => p.category === 'food_drink'),
      'GET /api/places?category=food_drink filters accurately'
    );

    // Test 10: Contributors
    const contribs = await apiFetch('/api/contributions');
    assert(
      contribs.status === 200 && contribs.data.some((c: any) => c.name === 'Đặng Cao Cường'),
      'GET /api/contributions returns survey contributors from Read_me.txt'
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
