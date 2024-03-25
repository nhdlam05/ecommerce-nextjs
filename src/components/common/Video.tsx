import CameraOffBackground from 'context/video-call/components/CameraOffBackground';
import { forwardRef, useState } from 'react';
import './Video.scss';

export enum VIDEO_STATE {
    LOADING = 'LOADING',
    PAUSE = 'PAUSE',
    PLAYING = 'PLAYING',
}

const Video = forwardRef<any, any>(
    (
        { style, size = 'm', cameraOffData, onLoaded, defaultState, ...props },
        ref
    ) => {
        const [state, setState] = useState<VIDEO_STATE>(defaultState);

        const onLoadStart = () => {
            if (defaultState === VIDEO_STATE.LOADING) {
                setState(VIDEO_STATE.LOADING);
            }
        };

        const onCanPlay = () => {
            setState(VIDEO_STATE.PLAYING);
            onLoaded && onLoaded();
        };

        const onAbort = () => {
            setState(VIDEO_STATE.PAUSE);
        };

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
                    {...{ ['data-state']: state }}
                    onLoadStart={onLoadStart}
                    onAbort={onAbort}
                    onCanPlay={onCanPlay}
                    ref={ref}
                    width="100%"
                    height="100%"
                    className={`${props.className} ${
                        state === VIDEO_STATE.PLAYING ? '' : 'hidden'
                    }`}
                    {...props}
                />
            </>
        );
    }
);

export default Video;
