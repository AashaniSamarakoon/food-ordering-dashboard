import React, { useState, useEffect } from 'react';

const NetworkDiagnostic = () => {
  const [results, setResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // Run basic diagnostics on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const runTests = async () => {
    setIsLoading(true);
    const tests = {};
    
    // Test token validity
    try {
      if (token) {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const exp = payload.exp;
          const now = Math.floor(Date.now() / 1000);
          
          tests.token = {
            valid: exp > now,
            expiry: new Date(exp * 1000).toLocaleString(),
            subject: payload.sub,
            roles: payload.roles,
            isExpired: exp <= now
          };
        } else {
          tests.token = { valid: false, error: 'Invalid token format' };
        }
      } else {
        tests.token = { valid: false, error: 'No token available' };
      }
    } catch (error) {
      tests.token = { valid: false, error: error.message };
    }
    
    // Test direct fetch call to menu items endpoint
    try {
      tests.menuItemsFetch = await testEndpoint(
        'Menu Items Fetch', 
        'http://localhost:8081/api/menu-items/my-restaurant',
        { headers: { Authorization: `Bearer ${token}` }}
      );
    } catch (error) {
      tests.menuItemsFetch = {
        success: false,
        error: error.message
      };
    }
    
    // Test with XMLHttpRequest
    tests.menuItemsXhr = await testWithXhr(
      'http://localhost:8081/api/menu-items/my-restaurant',
      token
    );
    
    // Test with fetch to the health endpoint
    try {
      tests.healthCheck = await testEndpoint(
        'Health Check',
        'http://localhost:8081/api/health'
      );
    } catch (error) {
      tests.healthCheck = {
        success: false,
        error: error.message
      };
    }
    
    setResults(tests);
    setIsLoading(false);
  };
  
  // Helper function to test endpoints
  const testEndpoint = async (name, url, options = {}) => {
    console.log(`Testing ${name}: ${url}`);
    try {
      const startTime = Date.now();
      const response = await fetch(url, options);
      const responseTime = Date.now() - startTime;
      
      let responseData;
      let responseText = '';
      
      try {
        responseText = await response.text();
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          responseData = { parseError: e.message };
        }
      } catch (e) {
        responseText = `Error reading response: ${e.message}`;
      }
      
      return {
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        responseTime,
        responseText: responseText.substring(0, 500),
        responseData
      };
    } catch (error) {
      console.error(`Error testing ${name}:`, error);
      return {
        success: false,
        error: error.toString()
      };
    }
  };
  
  // Test with XMLHttpRequest
  const testWithXhr = (url, token) => {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      const startTime = Date.now();
      
      xhr.open('GET', url, true);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      
      xhr.onload = function() {
        const responseTime = Date.now() - startTime;
        let responseData;
        
        try {
          responseData = JSON.parse(xhr.responseText);
        } catch (e) {
          responseData = { parseError: e.message };
        }
        
        resolve({
          success: xhr.status >= 200 && xhr.status < 300,
          status: xhr.status,
          statusText: xhr.statusText,
          responseTime,
          responseText: xhr.responseText.substring(0, 500),
          responseData
        });
      };
      
      xhr.onerror = function() {
        const responseTime = Date.now() - startTime;
        resolve({
          success: false,
          status: 'Network Error',
          responseTime,
          error: 'Network request failed'
        });
      };
      
      xhr.send();
    });
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', margin: '20px', borderRadius: '8px' }}>
      <h3>Network Diagnostic Tool</h3>
      
      <div>
        <h4>JWT Token</h4>
        <textarea 
          value={token} 
          onChange={(e) => setToken(e.target.value)}
          style={{ width: '100%', height: '60px' }}
        />
        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
          Token from localStorage is shown. You can modify it for testing.
        </div>
      </div>
      
      <button 
        onClick={runTests}
        disabled={isLoading}
        style={{ 
          marginTop: '15px',
          padding: '10px 15px', 
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'default' : 'pointer',
          opacity: isLoading ? 0.7 : 1
        }}
      >
        {isLoading ? 'Running Tests...' : 'Run Network Tests'}
      </button>
      
      {Object.keys(results).length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4>Test Results:</h4>
          
          {/* Token result */}
          <div style={{ 
            padding: '15px', 
            marginBottom: '10px',
            backgroundColor: results.token?.valid ? '#e8f5e9' : '#ffebee',
            border: `1px solid ${results.token?.valid ? '#4CAF50' : '#f44336'}`,
            borderRadius: '4px'
          }}>
            <h5 style={{ margin: '0 0 10px 0' }}>Token Validation</h5>
            {results.token?.valid ? (
              <div>
                <p>✅ Token is valid</p>
                <p>Expires: {results.token.expiry}</p>
                <p>Subject: {results.token.subject}</p>
                <p>Roles: {JSON.stringify(results.token.roles)}</p>
              </div>
            ) : (
              <p>❌ Token is invalid: {results.token?.error || 'Unknown error'}</p>
            )}
          </div>
          
          {/* Display each endpoint test result */}
          {Object.entries(results)
            .filter(([key]) => key !== 'token')
            .map(([testName, result]) => (
              <div 
                key={testName}
                style={{ 
                  padding: '15px', 
                  marginBottom: '10px',
                  backgroundColor: result.success ? '#e8f5e9' : '#ffebee',
                  border: `1px solid ${result.success ? '#4CAF50' : '#f44336'}`,
                  borderRadius: '4px'
                }}
              >
                <h5 style={{ margin: '0 0 10px 0' }}>{testName}</h5>
                {result.success ? (
                  <>
                    <p>✅ Success</p>
                    <p>Status: {result.status} {result.statusText}</p>
                    <p>Response Time: {result.responseTime}ms</p>
                    {result.responseText && (
                      <div>
                        <strong>Response:</strong>
                        <pre style={{ maxHeight: '100px', overflow: 'auto', background: '#f5f5f5', padding: '5px' }}>
                          {result.responseText}
                        </pre>
                      </div>
                    )}
                  </>
                ) : (
                  <p>❌ Error: {result.error || `Status: ${result.status}`}</p>
                )}
              </div>
            ))}
          
          <div style={{ marginTop: '20px' }}>
            <h4>Fix Recommendations:</h4>
            <ul>
              {!results.token?.valid && (
                <li style={{ color: '#f44336' }}>
                  <strong>Your JWT token is invalid or expired.</strong> Please log in again.
                </li>
              )}
              {results.menuItemsFetch?.error?.includes('fetch') && (
                <li style={{ color: '#f44336' }}>
                  <strong>Network connection issue detected.</strong> Check if your restaurant service is running on port 8081.
                </li>
              )}
              {(results.menuItemsFetch?.status === 401 || results.menuItemsXhr?.status === 401) && (
                <li style={{ color: '#f44336' }}>
                  <strong>Authentication failure (401).</strong> Your token is invalid or expired.
                </li>
              )}
              {(results.menuItemsFetch?.status === 403 || results.menuItemsXhr?.status === 403) && (
                <li style={{ color: '#f44336' }}>
                  <strong>Permission denied (403).</strong> Your user doesn't have the RESTAURANT_ADMIN role.
                </li>
              )}
              {results.healthCheck?.error?.includes('fetch') && (
                <li style={{ color: '#f44336' }}>
                  <strong>Cannot connect to restaurant service.</strong> Please check if it's running.
                </li>
              )}
              {results.menuItemsXhr?.success && !results.menuItemsFetch?.success && (
                <li style={{ color: '#4CAF50' }}>
                  <strong>XHR works but fetch doesn't.</strong> Consider switching to XHR in your service.
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkDiagnostic;