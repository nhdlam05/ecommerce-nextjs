import Checkbox from 'atoms/Checkbox/Checkbox';
import { CommunicationMedium } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import React from 'react';
import {
    BsChatDotsFill,
    BsFillCameraVideoFill,
    BsFillPeopleFill,
} from 'react-icons/bs';
import { IoIosCall } from 'react-icons/io';
import { Translatable } from 'translation';

interface Props {
    handleSessionTypeChosen: (s: CommunicationMedium) => void;
    format?: 'h' | 'v';
    size?: 'm' | 'l' | 'xl';
    align?: 'left' | 'center';
    extraInfo?: React.ReactNode;
    hasLocation?: boolean;
}

const session_type_data: Array<{
    icon: React.ReactNode;
    value: CommunicationMedium;
    label: Translatable;
}> = [
    {
        icon: <BsChatDotsFill />,
        value: CommunicationMedium.LiveChat,
        label: 'booking.communication.medium.live.chat',
    },
    {
        icon: <IoIosCall />,
        value: CommunicationMedium.AudioCall,
        label: 'booking.communication.medium.audio.call',
    },
    {
        icon: <BsFillCameraVideoFill />,
        value: CommunicationMedium.VideoCall,
        label: 'booking.communication.medium.video.call',
    },
];

const BookingSessionType: React.FC<Props> = ({
    handleSessionTypeChosen,
    format = 'h',
    size = 'm',
    align = 'center',
    extraInfo,
    hasLocation,
}) => {
    const className = ['gf gf_h_center', format === 'v' ? 'gf_v' : 'gf_gap_s']
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    const { translate } = useTranslationWithContext();

    function handleRadio(e: any) {
        handleSessionTypeChosen(e.target.value);
    }

    const sessionTypeData = hasLocation
        ? session_type_data.concat({
              icon: <BsFillPeopleFill />,
              value: CommunicationMedium.InPerson,
              label: 'booking.communication.medium.in.person',
          })
        : session_type_data;

    return (
        <div className={className}>
            {sessionTypeData.map((element, index) => {
                return (
                    <div key={index} className="gfItem_stretch">
                        <Checkbox
                            fullsize
                            id={element?.value}
                            value={element?.value}
                            type="radio"
                            name="session_type"
                            size={size}
                            align={align}
                            onClick={handleRadio}
                        >
                            <strong>
                                {element?.icon} {translate(element?.label)}
                            </strong>
                            {extraInfo && extraInfo}
                        </Checkbox>
                    </div>
                );
            })}
        </div>
    );
};

export default BookingSessionType;
