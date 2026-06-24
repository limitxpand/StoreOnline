async function login() {
  try {
    const startCSRF = Date.now();
    const csrfRes = await fetch('https://store-online-market-qggj5ykrs-limit-xpand.vercel.app/api/auth/csrf');
    const csrfData = await csrfRes.json();
    const csrfToken = csrfData.csrfToken;
    const cookies = csrfRes.headers.get('set-cookie');

    // Make the actual login request
    console.log(`Sending login request with CSRF: ${csrfToken}`);
    const startLogin = Date.now();
    const res = await fetch('https://store-online-market-qggj5ykrs-limit-xpand.vercel.app/api/auth/callback/credentials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookies
      },
      body: new URLSearchParams({
        csrfToken: csrfToken,
        email: 'admin',
        password: 'admin',
        redirect: 'false',
        json: 'true'
      }).toString()
    });

    const endLogin = Date.now();
    console.log(`Login API response time: ${endLogin - startLogin}ms`);
    
    const text = await res.text();
    try {
      const data = JSON.parse(text);
      console.log("Login Response Data:", data);
      if (data.ok) {
        console.log("SUCCESS: Logged in instantly!");
      } else {
        console.log("FAILED:", data.error);
      }
    } catch (e) {
      console.log("Response was not JSON. HTML output:");
      console.log(text.substring(0, 200) + '...');
    }

  } catch (err) {
    console.error(err);
  }
}

login();
