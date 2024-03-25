import Divider from 'atoms/Divider/Divider';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';

export default function WhyThisSelection() {
    return (
        <>
            <Divider spacing="xs" invisible />

            <Title size="m">
                Im Hintergrund berechnet Aepsy deine Auswahl wie folgt:
            </Title>
            <Text tag="div">
                <ul>
                    <li>
                        Wir kombinieren Ort, Symptome, Umstände und Methode
                        basierend auf deiner Auswahl
                    </li>
                    <li>
                        Vergleichen es mit Expertise, Methoden und
                        Verfügbarkeiten der Psycholog:innen
                    </li>
                    <li>
                        Vergleichen es mit Expertise, Methoden und
                        Verfügbarkeiten der Psycholog:innen
                    </li>
                </ul>
            </Text>

            <Divider spacing="xs" invisible />

            {/* <Text>
                Aufgrund der Gewichtung kann es sein, dass ein/eine
                Therapeut/in, die nicht in deiner Region arbeitet trotzdem
                zuerst angezeigt wird. Vielleicht, weil die Expertise mit deinem
                Bedürfnis zusammen passt oder/und weil eine Online-Therapie
                möglich ist.
            </Text> */}
        </>
    );
}
