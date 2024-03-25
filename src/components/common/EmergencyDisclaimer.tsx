import Text from 'atoms/Text/Text';
import { Trans } from 'react-i18next';

const EmergencyDisclaimer = () => {
    return (
        <div className="EmergencyDisclaimer">
            <Text align="center" size="xs">
                <Trans i18nKey="setting.legal.mergency.disclaimer">
                    <a
                        className="is-blended"
                        href="https://www.ch.ch/de/notfallnummern-erste-hilfe/"
                        rel="noreferrer"
                        target="_blank"
                    />
                </Trans>
            </Text>
        </div>
    );
};

export default EmergencyDisclaimer;
