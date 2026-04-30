// storage.js — 사용자 데이터 로컬 저장 관리

const STORAGE_KEY = 'jjansuni_profile';
const API_KEY_STORAGE = 'jjansuni_apikey';

const Storage = {
  // 프로필 저장
  saveProfile(profile) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch(e) { console.warn('저장 실패:', e); }
  },

  // 프로필 불러오기
  loadProfile() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch(e) { return null; }
  },

  // 프로필 초기화
  clearProfile() {
    localStorage.removeItem(STORAGE_KEY);
  },

  // API 키 저장 (세션 스토리지 — 탭 닫으면 삭제)
  saveApiKey(key) {
    try {
      sessionStorage.setItem(API_KEY_STORAGE, key);
    } catch(e) {}
  },

  loadApiKey() {
    try {
      return sessionStorage.getItem(API_KEY_STORAGE) || '';
    } catch(e) { return ''; }
  },

  clearApiKey() {
    sessionStorage.removeItem(API_KEY_STORAGE);
  },

  // 프로필 있는지 확인
  hasProfile() {
    return !!this.loadProfile();
  }
};

window.Storage = Storage;
