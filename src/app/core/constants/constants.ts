export enum ALERT_TYPE {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning',
}

export const LOGIN = {
  loginFirst: 'You must be logged in first.',
  loginFailed: 'Login failed. Please try again.',
};

export const ALERT = {
  common: {
    error: {
      title: 'Error',
      message: 'An error occurred while processing your request.',
      type: ALERT_TYPE.ERROR,
    },
  },
  post: {
    addSuccess: {
      title: 'Success',
      message: 'Post created successfully.',
      type: ALERT_TYPE.SUCCESS,
    },
    addError: {
      title: 'Error',
      message: 'An error occurred while creating the post.',
      type: ALERT_TYPE.ERROR,
    },
  },
};
