import { apiCall } from './apiCall';

export const authService = {
  login: (username, password) => {
    return apiCall('/api/session', 'POST', {
      model: {
        timeout: 259200
      },
      auth: [
        [
          "password",
          {
            username,
            password
          }
        ]
      ]
    });
  }
};


