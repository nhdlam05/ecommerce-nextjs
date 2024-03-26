import Divider from 'atoms/Divider/Divider';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import React from 'react';

const WhatIsWaitingListInformation: React.FC = () => {
    return (
        <Section>
            <Divider spacing="xs" invisible />
            <Text>
                Mit einem Wartelistenplatz weiss die Therapeutin, dass du gerne
                eine Therapiesitzung vereinbaren möchtest. Sobald sie freie
                Plätze hat, nimmt sie, unter von dir definierten
                Kontaktmöglichkeiten, Kontakt auf.
            </Text>
            <Text>
                Aus der Wartelisteneintragung erwächst keine finanzielle
                Verpflichtung oder die Pflicht einen freien Terminplatz
                anzunehmen. Gleichzeitig sind die Angaben zur Wartezeit
                unverbindlich und können stark variieren. Die Therapeutin ist
                nicht verpflichtet aufgrund des Wartelistenplatzes KlientInnen
                zu priorisieren oder einen Therapieplatz zu garantieren.
            </Text>
            <Title size="m" theme="dark">
                Fragen?
            </Title>
            <Text>
                <a href="mailto:care@aepsy.com">Kontaktiere uns</a>
            </Text>
        </Section>
    );
};

export default WhatIsWaitingListInformation;
