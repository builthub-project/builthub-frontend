import { KeycloakService } from 'keycloak-angular';

export function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: 'localhost',
        //url: 'http://localhost:8080',
        realm: 'localhost',
        clientId: 'localhost',
      },
      bearerExcludedUrls: ['/assets'],
      loadUserProfileAtStartUp: true, // getUserName
      enableBearerInterceptor: true,
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
      },
    });
}
