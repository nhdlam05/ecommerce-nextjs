import { isPlatform } from '@ionic/react';

const usePlatform = () => {
    const isNativeApp = isPlatform('hybrid');
    const isDesktop = isPlatform('desktop');
    const isIos = isPlatform('ios');
    const isAndroid = isPlatform('android');
    const isTablet = isPlatform('tablet');
    const isMobile = isIos || isAndroid || isNativeApp;

    return { isNativeApp, isDesktop, isIos, isAndroid, isMobile, isTablet };
};

export default usePlatform;
