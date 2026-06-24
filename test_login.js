async function login() {
  try {
    const csrfRes = await fetch('https://store-online-market-ke0rac6ul-limit-xpand.vercel.app/api/auth/csrf');
    const csrfData = await csrfRes.json();
    const csrfToken = csrfData.csrfToken;
    const cookies = csrfRes.headers.get('set-cookie');

    const res = await fetch('https://store-online-market-ke0rac6ul-limit-xpand.vercel.app/api/auth/callback/credentials', {
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

    const data = await res.json();
    console.log("Login Response:", data);
  } catch (err) {
    console.error(err);
  }
}

login();
