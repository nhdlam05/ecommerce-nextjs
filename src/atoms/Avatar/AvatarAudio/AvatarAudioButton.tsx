import { FaPause, FaPlay } from 'react-icons/fa';
import './AvatarAudio.scss';

interface Props {
    onChange: VoidFunction;
    isOff: boolean;
    isPlaying: boolean;
}

const AvatarAudioButton: React.FC<Props> = ({ onChange, isOff, isPlaying }) => {
    const handleToggle = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        onChange();
    };

    return (
        <div
            className={`AvatarAudioButton ${isOff ? 'is-off' : ''}`}
            onClick={handleToggle}
        >
            {isPlaying ? <FaPause /> : <FaPlay />}
        </div>
    );
};
export default AvatarAudioButton;
