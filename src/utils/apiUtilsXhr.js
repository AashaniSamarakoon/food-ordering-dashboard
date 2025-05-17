/**
 * Makes an API request using XMLHttpRequest as a more reliable alternative to fetch
 */
export const makeXhrRequest = (url, method = 'GET', data = null, headers = {}) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.open(method, url, true);
    
    // Set headers
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });
    
    // Set auth header if token exists
    const token = localStorage.getItem('token');
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }
    
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        let responseData;
        try {
          responseData = xhr.responseText ? JSON.parse(xhr.responseText) : {};
        } catch (e) {
          console.error('Error parsing response:', e);
          reject(new Error('Invalid JSON response'));
          return;
        }
        resolve(responseData);
      } else {
        reject({
          status: xhr.status,
          statusText: xhr.statusText,
          response: xhr.responseText
        });
      }
    };
    
    xhr.onerror = function() {
      reject({
        status: 0,
        statusText: 'Network Error',
        response: 'Failed to connect to server'
      });
    };
    
    if (data) {
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(data));
    } else {
      xhr.send();
    }
  });
};