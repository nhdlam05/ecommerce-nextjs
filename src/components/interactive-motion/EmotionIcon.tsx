import grinningFaceWithBigEyes from 'assets/img/emojis/grinning-face-with-big-eyes.png'; // 😃
import neutralFace from 'assets/img/emojis/neutral-face.png'; // 😐
import pensiveFace from 'assets/img/emojis/pensive-face.png'; // 😫
import slightlyFrowningFace from 'assets/img/emojis/slightly-frowning-face.png'; // 🙁
import slightlySmilingFace from 'assets/img/emojis/slightly-smiling-face.png'; // 🙂
import starStruck from 'assets/img/emojis/star-struck.png'; // 🤩
import tiredFace from 'assets/img/emojis/tired-face.png'; // 😫
import Image from 'atoms/Image/Image';

interface Props {
    value: number;
}

// const EMOTIONS = ["😫", "😔", "😔", "🙁", "🙁", "😐", "🙂", "🙂", "😃", "😃", "🤩"];

const EMOTIONS = [
    tiredFace,
    pensiveFace,
    pensiveFace,
    slightlyFrowningFace,
    slightlyFrowningFace,
    neutralFace,
    slightlySmilingFace,
    slightlySmilingFace,
    grinningFaceWithBigEyes,
    grinningFaceWithBigEyes,
    starStruck,
];

const EmotionIcon: React.FC<Props> = ({ value }) => {
    return EMOTIONS[value] ? (
        <div className="EmotionIcon">
            <Image objectFit="contain" src={EMOTIONS[value]} alt="emojis" />
        </div>
    ) : null;
};

export default EmotionIcon;
