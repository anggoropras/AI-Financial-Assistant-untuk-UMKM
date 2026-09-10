import { UserProfile } from '../../types';

// Mock user awal untuk akun demo
const DEFAULT_USER: UserProfile = {
  id: 'user_umkm_01',
  email: 'budi.santoso@warungberkah.id',
  name: 'Budi Santoso',
  businessName: 'Warung Berkah Jaya',
  businessType: 'Kuliner & Warung Sembako'
};

const STORAGE_KEY_USER = 'afin_mock_user';
const STORAGE_KEY_USERS_LIST = 'afin_registered_users';

function getRegisteredUsers(): UserProfile[] {
  const raw = localStorage.getItem(STORAGE_KEY_USERS_LIST);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // fallback jika json rusak
    }
  }
  const initial = [DEFAULT_USER];
  localStorage.setItem(STORAGE_KEY_USERS_LIST, JSON.stringify(initial));
  return initial;
}

function saveRegisteredUser(user: UserProfile) {
  const users = getRegisteredUsers();
  const index = users.findIndex(
    (u) => u.email.toLowerCase() === user.email.toLowerCase() || u.id === user.id
  );
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(STORAGE_KEY_USERS_LIST, JSON.stringify(users));
}

export const authService = {
  getCurrentUser(): UserProfile | null {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (raw === 'null') return null;
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return DEFAULT_USER;
      }
    }
    // Default aktif saat pertama kali buka agar UI langsung dapat dieksplorasi
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(DEFAULT_USER));
    return DEFAULT_USER;
  },

  async login(email: string, _password: string): Promise<UserProfile> {
    // Simulasi delay login
    await new Promise((r) => setTimeout(r, 400));
    
    const cleanEmail = (email || '').trim().toLowerCase();
    const users = getRegisteredUsers();

    // 1. Cari apakah akun ini pernah terdaftar
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(existing));
      return existing;
    }

    // 2. Jika akun demo default
    if (!cleanEmail || cleanEmail === DEFAULT_USER.email.toLowerCase()) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(DEFAULT_USER));
      return DEFAULT_USER;
    }

    // 3. Jika login langsung dengan email baru, buatkan identitas unik tersendiri
    const newUser: UserProfile = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      email: cleanEmail,
      name: cleanEmail.split('@')[0].replace('.', ' ').replace(/^./, (str) => str.toUpperCase()),
      businessName: `Usaha ${cleanEmail.split('@')[0]}`,
      businessType: 'Usaha Dagang & Jasa'
    };
    saveRegisteredUser(newUser);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    return newUser;
  },

  async register(name: string, email: string, _password: string, businessName: string): Promise<UserProfile> {
    await new Promise((r) => setTimeout(r, 400));
    
    const cleanEmail = (email || '').trim().toLowerCase();
    const users = getRegisteredUsers();

    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      const updatedUser: UserProfile = {
        ...existing,
        name: name.trim() || existing.name,
        businessName: (businessName || '').trim() || existing.businessName
      };
      saveRegisteredUser(updatedUser);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
      return updatedUser;
    }

    const newUser: UserProfile = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: cleanEmail,
      name: name.trim(),
      businessName: (businessName || '').trim() || 'Usaha UMKM Baru',
      businessType: 'Toko & Jasa'
    };
    saveRegisteredUser(newUser);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(newUser));
    return newUser;
  },

  async logout(): Promise<void> {
    await new Promise((r) => setTimeout(r, 200));
    localStorage.setItem(STORAGE_KEY_USER, 'null');
  }
};
