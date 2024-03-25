import './AvatarAudio.scss';

export default function AvatarAudio() {
    return (
        <div className="AvatarAudio">
            {/* {gbContext.audioIsPlaying ? "PLAY AUDIO" : "Default"} */}
            <div className="AvatarAudio--soundCircleWrapper">
                <div className="AvatarAudio--soundCircle"></div>
                <div className="AvatarAudio--soundCircleOut"></div>
            </div>
        </div>
    );
}
