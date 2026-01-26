export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_NUMBER_REGEX = /^[6-9]\d{9}$/;


export const METHOD = Object.freeze({
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH',
});

export const AUTH_TYPE = Object.freeze({
    UN_AUTH: 'unAuth',
    AUTH: 'Auth',
});