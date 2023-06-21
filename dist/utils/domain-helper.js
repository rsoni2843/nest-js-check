"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDomain = void 0;
const getDomain = (url) => {
    let domain = null;
    if (url.indexOf('://') > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }
    domain = domain.split(':')[0];
    domain = domain.replace(/^www\./i, '');
    domain = domain.split('.').slice(-2).join('.');
    return domain;
};
exports.getDomain = getDomain;
//# sourceMappingURL=domain-helper.js.map