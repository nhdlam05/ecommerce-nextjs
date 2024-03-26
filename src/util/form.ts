import {
    isArray,
    isBoolean,
    isEmpty,
    isNil,
    isNumber,
    isString,
    keys,
} from 'lodash';

export const getFormClassNameForCheckingDirty = (isDirty: boolean) => {
    return `FormContainer ${isDirty ? 'form-dirty' : ''}`;
};

export const isEmptyObj = (obj: any) => {
    if (isEmpty(obj)) return true;
    let result = true;
    keys(obj).forEach((key: string) => {
        if (!isEmpty(obj[key])) {
            result = false;
        }
    });
    return result;
};
