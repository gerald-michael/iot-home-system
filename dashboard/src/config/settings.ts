let DEBUG: boolean = process.env.NODE_ENV === 'development' ? true : false
let ORIGIN: string = window.location.origin
let LOGIN_URL = `${ORIGIN}/api/v1/accounts/auth/login/`;
let REGISTER_URL = `${ORIGIN}/api/v1/accounts/register/`;
let HOST_URL = `${ORIGIN}/api/v1/`;
let BASE_URL = `${ORIGIN}`
if (DEBUG) {
  LOGIN_URL = "http://localhost:8000/api/v1/accounts/auth/login/";
  REGISTER_URL = "http://localhost:8000/api/v1/accounts/register/";
  HOST_URL = "http://localhost:8000/api/v1/";
  BASE_URL = "http://localhost:8000"
}

export { HOST_URL, LOGIN_URL, REGISTER_URL, BASE_URL };
