import { SessionDuration } from 'components/booking';
import { SUPPORTED_USER_LANG, UserLang } from 'constants/common';
import i18n from 'i18n';
import {
    FunnelQuoteType,
    Gender,
    Maybe,
    ProviderEducationType,
    ProviderTitle,
    ProviderWorkType,
} from 'generated/graphql';
import { get, isEmpty, isNil, keys } from 'lodash';
import { ALLOWED_INSURANCE_COMPANIES } from 'pages/PartnersPage/components/partnerConfig';
import { Translatable } from 'translation';

// Cut text after a certain length
export function truncate(str: string, leng: number): string {
    return str.length > leng ? str.substring(0, leng - 3) + '...' : str;
}

export function getWorkType(): Array<{
    value: ProviderWorkType;
    label: Translatable;
}> {
    return [
        {
            value: ProviderWorkType.FullTime,
            label: 'provider.profile.work.full.time',
        },
        {
            value: ProviderWorkType.PartTime,
            label: 'provider.profile.work.part.time',
        },
        {
            value: ProviderWorkType.SelfEmployed,
            label: 'provider.profile.work.self.employed',
        },
        {
            value: ProviderWorkType.Freelance,
            label: 'provider.profile.work.freelance',
        },
        {
            value: ProviderWorkType.Internship,
            label: 'provider.profile.work.internship',
        },
        {
            value: ProviderWorkType.Seasonal,
            label: 'provider.profile.work.seasonal',
        },
    ];
}

export function getEducationType(): Array<{
    value: ProviderEducationType;
    label: Translatable;
}> {
    return [
        {
            value: ProviderEducationType.Bachelor,
            label: 'provider.profile.education.bachelor',
        },
        {
            value: ProviderEducationType.Master,
            label: 'provider.profile.education.master',
        },
        {
            value: ProviderEducationType.Doctor,
            label: 'provider.profile.education.doctor',
        },
        {
            value: ProviderEducationType.FutherEducation,
            label: 'provider.profile.education.further.education',
        },
        {
            value: ProviderEducationType.AdvancedEducation,
            label: 'provider.profile.education.advanced.education',
        },
    ];
}

export function getAgeList() {
    const age_items = [
        {
            value: '18-24',
            label: '18-24',
        },
        {
            value: '25-29',
            label: '25-29',
        },
        {
            value: '30-34',
            label: '30-34',
        },
        {
            value: '35-39',
            label: '35-39',
        },
        {
            value: '40-44',
            label: '40-44',
        },
        {
            value: '45-49',
            label: '45-49',
        },
        {
            value: '50-54',
            label: '50-54',
        },
        {
            value: '55-59',
            label: '55-59',
        },
        {
            value: '60-Plus',
            label: '60+',
        },
    ];

    return age_items;
}

export const GenderLabelMap: {
    [gender: string]: string;
} = {
    [Gender.Male]: 'generic.male',
    [Gender.Female]: 'generic.female',
};

export function getGenderOptions() {
    return [
        {
            value: Gender.Male,
            label: i18n.t(GenderLabelMap[Gender.Male]),
        },
        {
            value: Gender.Female,
            label: i18n.t(GenderLabelMap[Gender.Female]),
        },
    ];
}

// Check offering type (case-insensitive)
export const isCoaching = function (quoteType: FunnelQuoteType) {
    return (
        quoteType &&
        FunnelQuoteType.Coaching.toLowerCase() === quoteType.toLowerCase()
    );
};

export function isTherapy(quoteType: FunnelQuoteType): boolean {
    return (
        quoteType &&
        FunnelQuoteType.Therapy.toLowerCase() === quoteType.toLowerCase()
    );
}

// TODO: MOVE THIS LOGIC TO BACKEND
export const getSessionPrice = function (event: SessionDuration): number {
    switch (event.value) {
        case 60:
            return 138;
        case 90:
            return 207;
        default:
            return 69;
    }
};

export const scrollToElement = function scrollToElement(
    scrollElement: HTMLIonContentElement,
    targetElement: HTMLElement,
    offset = 25
) {
    scrollElement.getScrollElement().then((el) => {
        const scrollTop = el.scrollTop - scrollElement.offsetTop - offset;
        const scrollTargetTop = targetElement.getBoundingClientRect().top;

        scrollElement.scrollToPoint(0, scrollTop + scrollTargetTop, 300);
    });
};

export const paramByValueType = (value: any, splitBy = ',') => {
    if (typeof value === 'string') return value;
    if (typeof value === 'number') return value.toString();
    return value.join(splitBy);
};

export const mappingFilter = (
    list: Array<any>,
    dataList: Array<any>,
    name: string
) =>
    list.map((item: any) => {
        const foundItem = dataList.find((d: any) => d[name] === item.value);
        if (!foundItem) return item;
        return {
            ...item,
            ...foundItem,
        };
    });

export const generateUrlByKeys = (list: any) =>
    keys(list).reduce((acc: string, cur: any) => {
        const value = get(list, cur, '');
        if (isNil(value) || isEmpty(value)) return acc;
        const param = paramByValueType(value, ',');
        return (acc += `&${cur}=${param}`);
    }, '');

export const disableByCountAndChecked = (count: number, checked: boolean) => {
    if (count === 0 && !checked) return true;
    return false;
};

export const checkSelectablePackages = (id?: string) => {
    if (!id) return false;
    return Boolean(ALLOWED_INSURANCE_COMPANIES.includes(id));
};

export const getOriginalPathname = (pathname: string) =>
    `/${pathname.split('/')[1]}`;

export const getOriginalLocale = (locale: string): UserLang => {
    if (!locale || (locale && locale.length === 0)) return UserLang.German;
    const localeParsed = locale.split('-');
    const localeChecking = localeParsed[0] as UserLang;
    return SUPPORTED_USER_LANG.includes(localeChecking)
        ? localeChecking
        : UserLang.German;
};

export const stringToHash = (string: string): string => {
    let hash = 0;

    if (isEmpty(string)) return '';

    for (let i = 0; i < string.length; i++) {
        const char = string.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }

    return hash.toString();
};

export const convertNumToPercentage = (num?: Maybe<number>) =>
    typeof num === 'number' ? Math.floor(num * 1000) / 10 : 0;

export const convertFloatToNum = (number?: Maybe<number>) =>
    typeof number === 'number' ? Math.floor((number as number) * 10) / 10 : 0;

export const renderCurrencyLabel = (value: number) => `${value} CHF`;

export const getAepsyCallUrl = (currentLang: UserLang) => {
    if (process.env.REACT_APP_ENVIRONMENT !== 'prod') {
        return 'https://calendly.com/hanphan2706/15min';
    }

    switch (currentLang) {
        case UserLang.French:
            return 'https://calendly.com/ab--95e/30min';
        case UserLang.Italian:
        case UserLang.English:
            return 'https://calendly.com/aepsy-con-clara/30min';
        default:
            // GERMAN and ENGLISH
            return 'https://calendly.com/d/zyq-r74-mf7/get-to-know-aepsy';
    }
};

export const getFeedbackUrl = (currentLang: UserLang) => {
    switch (currentLang) {
        case UserLang.French:
            return 'https://docs.google.com/forms/d/e/1FAIpQLSdovEHxuN79BrCPpKJMFxYJrkMLDltIVvJjRiH_Wf-88pFgEA/viewform?usp=sf_link';
        case UserLang.English:
            return 'https://docs.google.com/forms/d/e/1FAIpQLSeT5KjRvzzJql6SfEFOiiKyGAza7O4xQJvX4m4LL8d11ntSsg/viewform?usp=sf_link';
        case UserLang.Italian:
            return 'https://docs.google.com/forms/d/e/1FAIpQLSf2QFFlubNn6EzsBofTy-zrTjDR1UX9g-ng-mRC821Rmw3Ilg/viewform?usp=sf_link';
        case UserLang.German:
        default:
            return 'https://forms.gle/7Am9tPazqXc7Rsgh7';
    }
};

export const getQuoteTypeByProviderTitle = (providerTitle: ProviderTitle) =>
    providerTitle === ProviderTitle.Psychologist
        ? FunnelQuoteType.Coaching
        : FunnelQuoteType.Therapy;
