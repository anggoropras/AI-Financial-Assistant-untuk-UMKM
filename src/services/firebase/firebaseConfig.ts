/**
 * Firebase Configuration (Placeholder untuk Phase 2 & 3)
 * Menampung inisialisasi Firebase App, Auth, dan Firestore saat Firebase dihubungkan.
 */

export interface FirebaseConfigStatus {
  isConfigured: boolean;
  projectId?: string;
}

export const firebaseStatus: FirebaseConfigStatus = {
  isConfigured: false,
  projectId: undefined
};
