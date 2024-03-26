import Divider from 'atoms/Divider/Divider';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import React from 'react';

interface Props {
    providerName: string;
}

const UserInfoCallBookingInformation: React.FC<Props> = ({ providerName }) => {
    return (
        <Section>
            <Title size="m">Wieso?</Title>
            <Text>
                {`Am Info-Call lernst du ${providerName} kennen. In ca. 5 - 10 Minuten wird Folgendes zusammen besprochen:`}
            </Text>
            <Text tag="div">
                <ul>
                    <li>Dein Anligen</li>
                    <li>Deine Fragen zum Ablauf und den Kosten</li>
                    <li>Terminfindung</li>
                </ul>
            </Text>
            <Title size="m">Vorbereitung</Title>
            <Text>
                Der Info-Call braucht keine Vorbereitung. Du kannst dir aber
                bereits über die Bezahlungsmöglichkeiten Gedanken machen. Anbei
                einige wichtigen Infos:
            </Text>
            <Text>
                <a
                    href="https://aepsy.com/therapie-bezahlen/"
                    rel="noreferrer"
                    target="_blank"
                >
                    Wie bezahle ich die Sitzungen nach dem Info-Call?
                </a>
            </Text>

            <Divider spacing="m" />
            <Title size="m">Fragen oder Planänderung?</Title>
            <Text>
                Bei Unklarheiten oder Terminänderungen{' '}
                <a href="mailto:care@aepsy.com">kontaktiere uns hier</a>.
            </Text>
        </Section>
    );
};

export default UserInfoCallBookingInformation;
