import { TrackingContext } from 'context/tracking';
import { TrackingProps } from 'context/tracking/TrackingProvider';
import { useContext } from 'react';

const useTracking = () => {
    const { track: trackEvent } = useContext(TrackingContext);

    const track = (input: TrackingProps) => {
        trackEvent(input);
    };

    return { track };
};

export default useTracking;
