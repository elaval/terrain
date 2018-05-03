interface AuthConfig {
  clientID: string;
  domain: string;
  callbackURL: string;
}

export const AUTH_CONFIG: AuthConfig = {
  clientID: 'yhlMHPKOt3M8iWf2OCWuG0FmeJNSIkBA',
  domain: 'firstmakers.auth0.com',
  callbackURL: `${window.location.href}`
};
