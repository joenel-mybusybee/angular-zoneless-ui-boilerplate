export const API_ROUTES = {
  auth: {
    login: 'auth/login',
    forgotPassword: 'auth/send-reset-password-email',
    refreshToken: 'auth/refresh',
  },
  main: {
    posts: {
      getAll: 'posts',
      add: 'posts/add',
    },
  },
};
