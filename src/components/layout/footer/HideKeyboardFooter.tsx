import Button from 'atoms/Button/Button';
import { BiDownArrowAlt } from 'react-icons/bi';
import { CSSTransition } from 'react-transition-group';
import './HideKeyboardFooter.scss';

const HideKeyboardFooter: React.FC = () => {
    return (
        <CSSTransition
            in={true}
            appear={true}
            timeout={{
                appear: 700,
                exit: 200,
            }}
            classNames="HideKeyboardFooterAnimation"
        >
            <div className="HideKeyboardFooter">
                <Button
                    label={<BiDownArrowAlt size="24" />}
                    size="s"
                    theme="white"
                    align="center"
                />
            </div>
        </CSSTransition>
    );
};

export default HideKeyboardFooter;
