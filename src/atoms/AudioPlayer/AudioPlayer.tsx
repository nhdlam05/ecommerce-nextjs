import { useEffect, useRef, useState } from 'react';
import './AudioPlayer.scss';
import Button from 'atoms/Button/Button';
import { BsFillPlayFill, BsPause } from 'react-icons/bs';
import { Box } from '@mui/material';
import Title from 'atoms/Title/Title';
import Text from 'atoms/Text/Text';
import LinearProgress from '@mui/material/LinearProgress';

interface Props {
    src: string;
    name: string;
}

const calculateTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${returnedSeconds}`;
};

enum PlayState {
    Play = 'PLAY',
    Pause = 'PAUSE',
}

const AudioPlayer: React.FC<Props> = ({ src, name }) => {
    const progressRef = useRef<any>(null);
    const audioRef = useRef<any>(null);
    const [duration, setDuration] = useState<number>();
    const [playState, setPlayState] = useState<PlayState>(PlayState.Pause);
    const [currentTime, setCurrentTime] = useState<number>(0);

    const onPlayClicked = () => {
        if (playState === PlayState.Pause) {
            audioRef.current.play();
            setPlayState(PlayState.Play);
        } else {
            audioRef.current.pause();
            setPlayState(PlayState.Pause);
        }
    };

    const onPregressClicked = (e: any) => {
        if (!duration) return;
        const barWidth = progressRef.current.clientWidth;
        const buffer = (window.innerWidth - barWidth) / 2;

        const progress = (e.clientX - buffer) / barWidth;
        const newCurrentTime = audioRef.current.duration * progress;
        setCurrentTime(newCurrentTime);
        audioRef.current.currentTime = newCurrentTime;

        if (playState === PlayState.Pause) {
            audioRef.current.play();
            setPlayState(PlayState.Play);
        }
    };

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.addEventListener('loadedmetadata', () => {
                setDuration(audioRef.current.duration);
            });

            audioRef.current.addEventListener('timeupdate', () => {
                setCurrentTime(audioRef.current.currentTime);
            });
        }
    }, [audioRef.current]);

    return (
        <div className="AudioPlayer">
            <Box display="flex" alignItems="center">
                <Button
                    label={
                        playState === PlayState.Pause ? (
                            <BsFillPlayFill size="24" />
                        ) : (
                            <BsPause size="24" />
                        )
                    }
                    size="s"
                    theme="ghosted"
                    onClick={onPlayClicked}
                />
                <Box sx={{ ml: 2 }}>
                    <Title size="s" noMargin>
                        {name}
                    </Title>
                    {duration && (
                        <Text size="xs">{calculateTime(duration)}</Text>
                    )}
                </Box>
            </Box>
            {duration && (
                <Box display="flex" alignItems="center" sx={{ mt: 1 }}>
                    <Box sx={{ width: '100%' }}>
                        <LinearProgress
                            ref={progressRef}
                            className="cursor-pointer"
                            onClick={onPregressClicked}
                            variant="determinate"
                            value={(currentTime / duration) * 100}
                        />
                    </Box>
                    <Box sx={{ ml: 1, width: '40px' }}>
                        <Text size="xs" align="right">
                            {calculateTime(currentTime)}
                        </Text>
                    </Box>
                </Box>
            )}

            <audio ref={audioRef} preload="metadata" src={src}>
                <source src={src} type="audio/mpeg" />
            </audio>
        </div>
    );
};

export default AudioPlayer;
