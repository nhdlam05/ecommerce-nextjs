import CameraOffBackground from 'context/video-call/components/CameraOffBackground';
import { forwardRef, useEffect, useState } from 'react';
import { VIDEO_STATE } from './Video';
import './Video.scss';

const PreviewVideo = forwardRef<any, any>(
    (
        {
            style,
            size = 'm',
            hasLoading,
            isPause = false,
            cameraOffData,
            onLoaded,
            ...props
        },
        ref
    ) => {
        const [state, setState] = useState<VIDEO_STATE>(
            hasLoading ? VIDEO_STATE.LOADING : VIDEO_STATE.PAUSE
        );

        const onLoadStart = () => {
            if (hasLoading) {
                setState(VIDEO_STATE.LOADING);
            }
        };

        const onCanPlay = () => {
            setState(VIDEO_STATE.PLAYING);
            onLoaded && onLoaded();
        };

        useEffect(() => {
            if (isPause) {
                setState(VIDEO_STATE.PAUSE);
            }
        }, [isPause]);

        return (
            <>
                {state !== VIDEO_STATE.PLAYING && (
                    <div className="CameraOffBackground--content">
                        <CameraOffBackground
                            {...cameraOffData}
                            isLoading={state === VIDEO_STATE.LOADING}
                            size={size}
                        />
                    </div>
                )}
                <video
                    onLoadStart={onLoadStart}
                    onCanPlay={onCanPlay}
                    ref={ref}
                    width="100%"
                    height="100%"
                    className={`${
                        state === VIDEO_STATE.PLAYING ? '' : 'hidden'
                    }`}
                    {...props}
                />
            </>
        );
    }
);

export default PreviewVideo;
