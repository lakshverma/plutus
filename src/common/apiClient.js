import axios from 'axios';

/*
 * The axios instance every feature service uses.
 *
 * REACT_APP_API_URL is set at build time (in Vercel) to the deployed API origin.
 * It is deliberately left unset in development, where the empty default keeps
 * requests relative so the CRA dev server's "proxy" field in package.json can
 * forward them to the local backend. That proxy applies to `react-scripts start`
 * only and has no effect on a build, which is why the variable exists at all:
 * without it a production bundle would resolve "/auth/login" against its own
 * origin, hit the SPA fallback and get HTML back instead of JSON.
 *
 * No auth interceptor here on purpose. Services attach their own Authorization
 * header, and two callers must not have one attached for them: resetRequest sends
 * the password reset token from the URL rather than the session token, and login
 * and recoverRequest are unauthenticated. See CLAUDE.md.
 */
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
});

export default apiClient;
