import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getApiErrorMessage } from "../lib/api";
import { adminAuthApi } from "../services/adminAuthApi";

const initialState = {
  admin: null,
  sessionId: null,
  tokens: null,
  permissions: [],
  roles: [],
  sessions: [],
  passwordResetEmail: null,
  passwordResetToken: null,
  loading: false,
  error: null,
};

const authenticatedState = (auth) => ({
  admin: auth?.account || null,
  sessionId: auth?.sessionId || null,
  tokens: auth?.tokens || null,
  permissions: auth?.account?.permissions || [],
  roles: auth?.account?.roles || [],
  isAuthenticated: Boolean(auth?.tokens?.accessToken),
  loading: false,
  error: null,
});

export const useAuthStore = create(
  persist(
    (set, get) => ({
      ...initialState,
      isAuthenticated: false,

      login: async ({ email, password }) => {
        set({ loading: true, error: null });

        try {
          const auth = await adminAuthApi.login({ email, password });

          set(authenticatedState(auth));

          return auth;
        } catch (error) {
          const message = getApiErrorMessage(error);
          set({
            ...initialState,
            isAuthenticated: false,
            error: message,
          });
          throw new Error(message);
        }
      },

      logout: async () => {
        const hasToken = Boolean(get().tokens?.accessToken);

        try {
          if (hasToken) {
            await adminAuthApi.logout();
          }
        } finally {
          set({ ...initialState, isAuthenticated: false });
        }
      },

      clearAuth: () => set({ ...initialState, isAuthenticated: false }),

      registerAdmin: async ({ displayName, email, password, permissions, roles }) => {
        set({ loading: true, error: null });

        try {
          const auth = await adminAuthApi.register({
            displayName,
            email,
            password,
            permissions,
            roles,
          });

          set({ loading: false, error: null });
          return auth;
        } catch (error) {
          const message = getApiErrorMessage(error);
          set({ loading: false, error: message });
          throw new Error(message);
        }
      },

      refreshSession: async () => {
        const refreshToken = get().tokens?.refreshToken;
        if (!refreshToken) {
          set({ ...initialState, isAuthenticated: false });
          return null;
        }

        try {
          const auth = await adminAuthApi.refresh(refreshToken);
          const tokens = auth?.tokens || null;

          set({
            sessionId: auth?.sessionId || get().sessionId,
            tokens,
            isAuthenticated: Boolean(tokens?.accessToken),
            error: null,
          });

          return auth;
        } catch (error) {
          const message = getApiErrorMessage(error);
          set({ ...initialState, isAuthenticated: false, error: message });
          throw new Error(message);
        }
      },

      logoutAll: async () => {
        try {
          await adminAuthApi.logoutAll();
        } finally {
          set({ ...initialState, isAuthenticated: false });
        }
      },

      forgotPassword: async (email) => {
        set({ loading: true, error: null });

        try {
          const result = await adminAuthApi.forgotPassword(email);
          set({
            loading: false,
            error: null,
            passwordResetEmail: email,
            passwordResetToken: result?.developmentToken || null,
          });
          return result;
        } catch (error) {
          const message = getApiErrorMessage(error);
          set({ loading: false, error: message });
          throw new Error(message);
        }
      },

      verifyResetCode: async (token) => {
        set({ loading: true, error: null });

        try {
          const result = await adminAuthApi.verifyResetCode(token);
          set({
            loading: false,
            error: null,
            passwordResetToken: token,
          });
          return result;
        } catch (error) {
          const message = getApiErrorMessage(error);
          set({ loading: false, error: message });
          throw new Error(message);
        }
      },

      resetPassword: async ({ token, newPassword, confirmPassword }) => {
        set({ loading: true, error: null });

        try {
          const result = await adminAuthApi.resetPassword({
            token,
            newPassword,
            confirmPassword,
          });
          set({ ...initialState, isAuthenticated: false });
          return result;
        } catch (error) {
          const message = getApiErrorMessage(error);
          set({ loading: false, error: message });
          throw new Error(message);
        }
      },

      changePassword: async ({ currentPassword, newPassword }) => {
        set({ loading: true, error: null });

        try {
          const result = await adminAuthApi.changePassword({
            currentPassword,
            newPassword,
          });
          set({ ...initialState, isAuthenticated: false });
          return result;
        } catch (error) {
          const message = getApiErrorMessage(error);
          set({ loading: false, error: message });
          throw new Error(message);
        }
      },

      loadPermissions: async () => {
        const result = await adminAuthApi.getPermissions();
        set({
          permissions: result?.permissions || [],
          roles: result?.roles || [],
        });
        return result;
      },

      loadSessions: async () => {
        const sessions = await adminAuthApi.listSessions();
        set({ sessions: sessions || [] });
        return sessions;
      },

      revokeSession: async (sessionId) => {
        const result = await adminAuthApi.revokeSession(sessionId);
        set((state) => ({
          sessions: state.sessions.filter((session) => session.id !== sessionId),
        }));
        return result;
      },

      setupMfa: () => adminAuthApi.setupMfa(),
      verifyMfa: (code) => adminAuthApi.verifyMfa(code),
      challengeMfa: (email) => adminAuthApi.challengeMfa(email),
      disableMfa: () => adminAuthApi.disableMfa(),

      clearError: () => set({ error: null }),
    }),
    {
      name: "modevin-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        admin: state.admin,
        sessionId: state.sessionId,
        tokens: state.tokens,
        permissions: state.permissions,
        roles: state.roles,
        passwordResetEmail: state.passwordResetEmail,
        passwordResetToken: state.passwordResetToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
