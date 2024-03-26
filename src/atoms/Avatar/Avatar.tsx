import { AppContext } from 'context/app';
import { Maybe } from 'generated/graphql';
import { first, random, take } from 'lodash';
import { useContext, useEffect, useRef } from 'react';
import { FirebaseEventName, logFirebaseEvent } from 'service/auth';
import AvatarAudio from './AvatarAudio/AvatarAudio';
import AvatarAudioButton from './AvatarAudio/AvatarAudioButton';
import './_Avatar.scss';
import { useTranslationWithContext } from 'hooks';

interface Props {
    size?: string;
    align?: string;
    theme?: string;
    icon?: React.ReactNode;
    src?: Maybe<string>;
    audioSrc?: Maybe<string>;
    providerSlug?: Maybe<string>;
    name?: string;
    onClick?: VoidFunction;
    onAudioPlayerClick?: VoidFunction;
}

const Avatar: React.FC<Props> = ({
    size,
    align,
    theme,
    icon,
    src,
    audioSrc,
    name,
    providerSlug,
    onClick,
    onAudioPlayerClick,
}) => {
    const mod_class = [
        'Avatar',
        size ? 'size-' + size : '',
        align ? 'align-' + align : '',
        theme ? 'theme-' + theme : '',
    ].join(' ');

    const myAudioTag = useRef<any>(null);
    const { currentLang } = useTranslationWithContext();
    const { avatarAudioState, setAvatarAudioState } = useContext(AppContext);
    const { audioIsPlaying, currentAvatar, currentAvatarRef } =
        avatarAudioState;

    const avatarName = useRef(`avatar_${random(1000)}`);

    const renderAvatar = () => {
        switch (true) {
            case Boolean(icon):
                return (
                    <div className="Avatar--iconWrapper">
                        <div className="Avatar--icon">{icon}</div>
                    </div>
                );
            case Boolean(src):
                return (
                    <div
                        className="Avatar--image"
                        style={{
                            backgroundImage: 'url(' + src + ')',
                        }}
                    ></div>
                );
            default: {
                const buildAvatartName = () => {
                    if (!name) return 'A';
                    const nameArr = name.split(' ');
                    if (nameArr.length >= 2) {
                        return (
                            (first(nameArr[0]) || '') +
                            ((first(nameArr[1]) as string) || '')
                        );
                    }
                    return take(name, 2) || '';
                };
                return (
                    <div className="Avatar--initials">
                        <span>{buildAvatartName()}</span>
                    </div>
                );
            }
        }
    };

    const endAudio = async () => {
        if (currentAvatarRef) {
            currentAvatarRef.pause();
            currentAvatarRef.currentTime = 0;
        }
        setAvatarAudioState({
            currentAvatar: null,
            audioIsPlaying: false,
            currentAvatarRef: null,
        });
    };

    const playAudio = async () => {
        setAvatarAudioState({
            ...avatarAudioState,
            audioIsPlaying: true,
            currentAvatar: avatarName.current,
            currentAvatarRef: myAudioTag.current,
        });

        onAudioPlayerClick && onAudioPlayerClick();
    };

    useEffect(() => {
        if (currentAvatarRef) {
            currentAvatarRef.play();

            logFirebaseEvent('therapist_audio_played' as FirebaseEventName, {
                for_therapist: providerSlug,
            });
        }
    }, [currentAvatarRef]);

    const onAvatarClick = () => {
        onClick && onClick();
        endAudio();
    };

    const turnOnAnotherAudio = () => {
        if (currentAvatarRef) {
            currentAvatarRef.pause();
            currentAvatarRef.currentTime = 0;
        }
        setAvatarAudioState({
            ...avatarAudioState,
            currentAvatar: avatarName.current,
            currentAvatarRef: myAudioTag.current,
        });
    };

    const onAudioButtonChange = () => {
        if (audioIsPlaying) {
            if (currentAvatar === avatarName.current) {
                endAudio();
            } else {
                turnOnAnotherAudio();
            }
        } else {
            playAudio();
        }
    };

    useEffect(
        () => () => {
            setAvatarAudioState({
                currentAvatar: null,
                audioIsPlaying: false,
                currentAvatarRef: null,
            });
        },
        []
    );

    useEffect(() => {
        if (audioIsPlaying && currentAvatar === avatarName.current) {
            endAudio();
        }
    }, [currentLang]);

    const isPlaying = currentAvatar === avatarName.current && audioIsPlaying;

    return (
        <div className={`Avatar__wrapper ${isPlaying ? 'is-playing' : ''}`}>
            <div className={mod_class}>
                <div className="Avatar--image_wrapper" onClick={onAvatarClick}>
                    {renderAvatar()}
                </div>
                {/* Only if audioTrack */}
                {audioSrc && (
                    <>
                        <AvatarAudio />
                        <AvatarAudioButton
                            onChange={onAudioButtonChange}
                            isOff={audioIsPlaying}
                            isPlaying={isPlaying}
                        />

                        <audio src={audioSrc} ref={myAudioTag}>
                            <source src={audioSrc} type="audio/mpeg" />
                        </audio>
                    </>
                )}
            </div>
        </div>
    );
};

export default Avatar;
