import { usePlatform } from 'hooks';
import { get } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import SafeAreaContent from './SafeAreaContent';

interface Props {
    children: React.ReactNode;
    onIonScroll?: (e: any) => void;
    canStartScroll?: boolean;
    onScrollToDone?: VoidFunction;
    id?: string;
    skipFirstTimeEleFound?: boolean;
    // for some cases, first time the element is found with offset = 0
    // so we want to skip the first time and wait for it is rendered fully
}

const MAXIMUM_RETRY = 3;
const DEFAULT_OFFSET = 20;

const ScrollableContent: React.FC<Props> = ({
    children,
    onIonScroll,
    canStartScroll = true,
    onScrollToDone,
    skipFirstTimeEleFound,
    id = 'scrollable',
}) => {
    const { isNativeApp } = usePlatform();
    const contentRef = useRef<HTMLIonContentElement>(null);
    const timeoutRef: any = useRef();
    const scrollTimeoutRef: any = useRef();
    const location = useLocation();
    const { hash, key } = location;
    const history = useHistory();
    const [retry, setRetry] = useState(0);

    const enableScroll = () => {
        if (onScrollToDone) {
            scrollTimeoutRef.current = setTimeout(() => {
                onScrollToDone();
            }, 500);
        }
    };

    const scrollToPoint = () => {
        const ele = document.getElementById(hash.slice(1));
        if (ele) {
            const offset = get(ele, 'attributes.offset', DEFAULT_OFFSET);
            enableScroll();
            if (ele?.offsetTop === 0 && skipFirstTimeEleFound) {
                setRetry(retry + 1);
            } else {
                contentRef.current?.scrollToPoint(
                    0,
                    ele?.offsetTop + offset,
                    500
                );

                if (isNativeApp) {
                    // remove hash from url
                    // because it will cause the scrolling freeze
                    history.replace(location.pathname + location.search);
                }
            }
        } else {
            setRetry(retry + 1);
        }
    };

    useEffect(() => {
        if (hash && canStartScroll) {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            scrollToPoint();
        }
    }, [hash, key, canStartScroll]);

    useEffect(() => {
        if (retry > 0 && retry <= MAXIMUM_RETRY) {
            timeoutRef.current = setTimeout(() => {
                scrollToPoint();
            }, 500);
        }

        // fire callback function if can not find element
        if (retry > MAXIMUM_RETRY) {
            enableScroll();
        }

        return () => {
            clearTimeout(timeoutRef.current);
            if (scrollTimeoutRef.current)
                clearTimeout(scrollTimeoutRef.current);
        };
    }, [retry]);

    return (
        <SafeAreaContent
            scrollEvents
            onIonScroll={onIonScroll}
            ref={contentRef}
            id={id}
        >
            {children}
        </SafeAreaContent>
    );
};

export default ScrollableContent;
