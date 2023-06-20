export const getDomain = (url: string) => {
  let domain = null;
  // find & remove protocol (http, ftp, etc.) and get domain
  if (url.indexOf('://') > -1) {
    domain = url.split('/')[2];
  } else {
    domain = url.split('/')[0];
  }
  // remove port number
  domain = domain.split(':')[0];
  // remove "www" prefix
  domain = domain.replace(/^www\./i, '');
  // get the top-level domain (TLD)
  domain = domain.split('.').slice(-2).join('.');
  return domain;
};
