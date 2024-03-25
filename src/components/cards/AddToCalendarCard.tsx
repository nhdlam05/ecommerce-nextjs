import { Calendar } from '@ionic-native/calendar';
import Item from 'atoms/Item/Item';
import Module from 'atoms/Module/Module';
import { usePlatform, useToast, useTranslationWithContext } from 'hooks';
import { Event } from 'model/common';
import { useEffect, useState } from 'react';
import { AiFillApple, AiOutlineGoogle } from 'react-icons/ai';
import { RiMicrosoftFill } from 'react-icons/ri';
import helpersClass from 'util/helpers';
import './AddToCalendarCard.scss';

const helpers = new helpersClass();

type CalendarItem = {
    label: string;
    icon: React.ReactNode;
    value: 'google' | 'apple' | 'outlookcom';
};

const CALENDAR_ITEMS: CalendarItem[] = [
    {
        label: 'Google Calendar',
        icon: <AiOutlineGoogle />,
        value: 'google',
    },
    {
        label: 'Apple Calendar',
        icon: <AiFillApple />,
        value: 'apple',
    },
    {
        label: 'Mircosoft Outlook',
        icon: <RiMicrosoftFill />,
        value: 'outlookcom',
    },
];

interface Props {
    event: Event;
}

const AddToCalendarCard: React.FC<Props> = ({ event }) => {
    const [isCrappyIE, setIsCrappyIE] = useState(false);
    const { isNativeApp } = usePlatform();
    const { showToast } = useToast();
    const { translate } = useTranslationWithContext();

    useEffect(() => {
        // polyfill for startsWith to fix IE bug
        /* eslint-disable */
        if (!String.prototype.startsWith) {
            String.prototype.startsWith = function (searchString, position) {
                position = position || 0;
                return this.indexOf(searchString, position) === position;
            };
        }

        let isCrappyIE = false;
        const nav = window.navigator as any;

        if (
            typeof window !== 'undefined' &&
            nav.msSaveOrOpenBlob &&
            window.Blob
        ) {
            isCrappyIE = true;
        }

        setIsCrappyIE(isCrappyIE);
    }, []);

    const addToAppleCalendar = async () => {
        try {
            await Calendar.requestWritePermission();
            await Calendar.createEvent(
                event.title,
                event.location,
                event.description,
                event.startTime,
                event.endTime
            );
            showToast({
                message: translate('calendar.add.to.apple.calendar.success'),
                position: 'bottom',
                color: 'success',
            });
        } catch {
            showToast({
                message: translate('calendar.add.to.apple.calendar.failed'),
                position: 'bottom',
                color: 'primary',
            });
        }
    };

    const handleDropdownLinkClick = (e: any, item: CalendarItem) => {
        e.preventDefault();

        if (item.value === 'apple' && isNativeApp) {
            addToAppleCalendar();
            return;
        }

        let url = e.currentTarget.getAttribute('href');

        if (
            !helpers.isMobile() &&
            (url.startsWith('data') || url.startsWith('BEGIN'))
        ) {
            let filename = 'download.ics';
            let blob = new Blob([url], { type: 'text/calendar;charset=utf-8' });
            const nav = window.navigator as any;
            if (isCrappyIE) {
                nav.msSaveOrOpenBlob(blob, filename);
            } else {
                /****************************************************************
                // many browsers do not properly support downloading data URIs
                // (even with "download" attribute in use) so this solution
                // ensures the event will download cross-browser
                ****************************************************************/
                let link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } else {
            window.open(url, '_blank');
        }
    };
    return (
        <div className="AddToCalendarCard">
            <Module padding="none" highlightedShort>
                <div>
                    {CALENDAR_ITEMS.map((item: CalendarItem) => (
                        <Item
                            key={item.value}
                            title={item.label}
                            onClick={(e) => handleDropdownLinkClick(e, item)}
                            href={helpers.buildUrl(
                                event,
                                item.value,
                                isCrappyIE
                            )}
                            endSlot={item.icon}
                        />
                    ))}
                </div>
            </Module>
        </div>
    );
};

export default AddToCalendarCard;
