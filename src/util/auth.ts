export const getErrorMessageByErrorCode = (errorCode: string) => {
    switch (errorCode) {
        case 'auth/user-not-found':
            return 'error.auth.email.not.found';
        case 'auth/wrong-password':
            return 'error.auth.invalid.credentials';
        default:
            return 'generic.error.catch.message';
    }
};
