import Button from 'atoms/Button/Button';
import Icon, { IconLanguage } from 'atoms/Icon';
import { useRenderLanguage, useTranslationWithContext } from 'hooks';
import './LanguageSwitcher.scss';

interface Props {
    theme?: 'dark' | 'white';
    onClick: VoidFunction;
    className?: string;
    id?: string;
}

const LanguageSwitcherController: React.FC<Props> = ({
    onClick,
    theme = 'white',
    className = '',
    id,
}) => {
    const { currentLang } = useTranslationWithContext();
    const { renderLanguageByUserLang } = useRenderLanguage();

    return (
        <Button
            onClick={onClick}
            classes={`Popover-LanguageSwitcherController global_theme-green ${className}`}
            id={`Popover-LanguageSwitcher${id ? `-${id}` : ''}`}
            label={renderLanguageByUserLang(currentLang)}
            icon={<Icon icon={<IconLanguage />} theme={theme} size="xxs" />}
            variant="outlined"
            theme={theme}
            size="xs"
            radius="xxs"
        />
    );
};

export default LanguageSwitcherController;
