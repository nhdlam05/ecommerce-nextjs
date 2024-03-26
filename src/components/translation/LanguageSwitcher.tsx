import Item from 'atoms/Item';
import ItemGroup from 'atoms/ItemGroup';
import Popover from 'atoms/Popover';
import { SUPPORTED_APP_LANGUAGES_DATA } from 'constants/common';
import { AppLanguage } from 'generated/graphql';
import { useLocale, useRenderLanguage } from 'hooks';
import './LanguageSwitcher.scss';
import LanguageSwitcherController from './LanguageSwitcherController';

interface Props {
    id?: string;
    theme?: 'dark' | 'white';
    className?: string;
    onDone?: VoidFunction;
}

const LanguageSwitcher: React.FC<Props> = ({
    theme = 'white',
    className = '',
    onDone,
    id,
}) => {
    const { getTranslationObjectByUserLang } = useRenderLanguage();
    const { updateLanguage } = useLocale();

    const onUpdateLanguage = (language: AppLanguage) => {
        updateLanguage({ language, callback: onDone });
    };

    return (
        <Popover
            className={`Popover--noPadding LanguageSwitcher global_theme-green ${className}`}
            name={`LanguageSwitcher${id ? `-${id}` : ''}`}
            controller={LanguageSwitcherController}
            controllerProps={{ theme, className, id }}
            option={{ alignment: 'end' }}
            content={(props: any) => (
                <ItemGroup>
                    {SUPPORTED_APP_LANGUAGES_DATA.map((item: any) => {
                        const { text, flag } = getTranslationObjectByUserLang(
                            item.i18n
                        );
                        return (
                            <Item
                                button
                                key={item.value}
                                title={text}
                                endSlot={flag}
                                onClick={() => {
                                    onUpdateLanguage(item.value);
                                    props.onClose();
                                }}
                            />
                        );
                    })}
                </ItemGroup>
            )}
        />
    );
};

export default LanguageSwitcher;
