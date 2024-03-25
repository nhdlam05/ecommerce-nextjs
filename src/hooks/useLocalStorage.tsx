import { Storage } from '@capacitor/storage';
import { useEffect, useState } from 'react';
import { AnyObject } from 'yup/lib/types';
import { Optional } from '../model/common';

export async function setStorageKey(key: string, value: string) {
    await Storage.set({
        key,
        value,
    });
}

export async function getStorageKey(key: string): Promise<Optional<string>> {
    const result = await Storage.get({ key });

    return result?.value;
}

export async function removeStorageKey(key: string) {
    return await Storage.remove({ key });
}

function useLocalStorage() {
    return { setStorageKey, getStorageKey, removeStorageKey };
}

export default useLocalStorage;

export const useStorage = (key: string, defaultValue: string | AnyObject) => {
    const [value, setValue] = useState<any>();

    useEffect(() => {
        if (value || typeof value === 'string') {
            let newValue;
            try {
                newValue = JSON.stringify(value);
            } catch (e: any) {
                newValue = value;
            }
            Storage.set({
                key,
                value: newValue as string,
            });
        } else {
            getStorageKey(key).then((v) => {
                setValue(v ? JSON.parse(v) : []);
            });
        }
    }, [key, value, defaultValue]);

    return [value, setValue] as const;
};
