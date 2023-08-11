import app from './app';
import "reflect-metadata";

const port = process.env.PORT || 8000;

export const SECRET_KEY = "21aEN7yZ2Vfbl9lG7gfZNpPvd7crXOVaVf8rxZzKy5K7qNoNjeLY3hC0K/QDEaOEl7wbpWsxNv2tveAWm3VXODbzsWEu0bqh/qB1NuRjID7F0N+5UpO4bFqIHJpDtUST7ki2NiD8cKochBCBqaLRh3lAmiIFye7iaClR4A/i0hMkkMI22gAKH4oAZmevlOhj8Z6tgYBcHDpAUUxmxRDd0jE8sN1KAgcvq9zl+rG45aEPDKLhqbjpaiEgAts5oLPLDGv2crhDMnjSMDCJSuKckmEnLpJ999cjYWC0FkvJUBK7Me+GYLx2irx9V+xbwmZuEERolIpyfS7dfBlLYyR1qw==";


app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
