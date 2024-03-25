import Divider from 'atoms/Divider/Divider';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';

// ONLY USED FOR LEGACY INFO CALL
export default function HowToPrepareInfoCallModal() {
    return (
        <>
            <Title size="m">Der Info-Call:</Title>
            <Text tag="div">
                <p>
                    Der Info-Call gibt dir die Möglichkeit die Klienten
                    kennenzulernen, Vertrauen zu schaffen und den Ersttermin zu
                    vereinbaren.{' '}
                </p>
                <p>
                    <strong>Der Inhalt</strong>{' '}
                </p>
                <p>
                    Aepsy informiert die Klienten vorab über den Inhalt des
                    Info-Calls. Folgende Dinge führen wir als mögliche
                    Besprechungspunkte auf:{' '}
                </p>
                <ul>
                    <li>Kennenlernen</li>
                    <li>Terminfindung</li>
                    <li>Kostenübernahme</li>
                    <li>Problemstellungen</li>
                    <li>Angewandte Methoden</li>
                    <li>Vor Ort oder Online</li>
                </ul>
                <p>
                    <strong>Möglicher Ablauf</strong>
                </p>
                <ol>
                    <li>Gesprächsführung übernehmen</li>
                    <li>Einfühlsam das Bedürfnis aufnehmen</li>
                    <li>Ablauf und Zweck Erstgespräch erläutern</li>
                    <li>Input zu Therapie und Einflussfaktoren </li>
                    <li>Terminvereinbarung</li>
                    <li>
                        Kostensituation ansprechen (Bei Bedarf Infomaterial
                        teilen:{' '}
                        <strong>
                            <a
                                target="_blank"
                                href="https://aepsy.com/tools/versicherungscheck/"
                            >
                                Versicherungscheck
                            </a>
                        </strong>
                        )
                    </li>
                    <li>Für Fragen die Kontaktangaben teilen</li>
                </ol>
                <p>
                    Andere Inhalte und Reihenfolgen sind möglich und
                    empfehlenswert. Die Auflistung ist als informative
                    Richtlinie zu verstehen.{' '}
                </p>
                <p>
                    <strong>Hintergrund &amp; Tipps</strong>
                </p>
                <ul>
                    <li>
                        Gewisse Klienten/innen sind{' '}
                        <strong>verunsichert</strong> und wagen sich das erste
                        Mal an eine Therapie - Stereotypen (aus Filmen o.ä.)
                        haften der Gesprächstherapie noch an.
                    </li>
                </ul>
                <p>
                    <strong>Tipp:</strong> Betone <strong>Vertrauen</strong> und
                    informiere einfühlsam über den Ablauf eines Erstgesprächs
                    und der Therapie. Der Mensch auf der anderen Seite möchte
                    sich aufgehoben und sicher fühlen.{' '}
                </p>
                <ul>
                    <li>
                        Die <strong>Kosten</strong> können bei Klienten/innen
                        wiederholt Sorgen auslösen. Manche fragen sich, wie
                        viele Stunden nötig sind, wie effektiv die Therapie ist
                        und ob sich der Aufwand lohnt.
                    </li>
                </ul>
                <p>
                    <strong>Tipps: Für Selbstzahler</strong> kann eine Therapie
                    teuer zu stehen kommen. Informiere über die mögliche{' '}
                    <strong>Effektivität einer Therapie</strong> und ihre
                    Einflussfaktoren, um Verunsicherungen zu lösen.{' '}
                </p>
                <ul>
                    <li>
                        Die <strong>Versicherungslandschaft</strong> in der
                        Schweiz ist kompliziert. Klienten/innen sind oft
                        ungenügend informiert. Nicht aus Desinteresse, sondern
                        Verunsicherung.
                    </li>
                </ul>
                <p>
                    <strong>Tipp:</strong> Es braucht keine
                    Versicherungsberatung. Stelle jedoch sicher, dass die{' '}
                    <strong>wichtigsten Aspekte vermittelt werden.</strong>{' '}
                    Unterstütze mit deiner Erfahrung und teile bei Bedarf mehr
                    Informationen, wie diesen Link:{' '}
                    <strong>
                        <a
                            target="_blank"
                            href="https://aepsy.com/tools/versicherungscheck/"
                        >
                            Versicherungscheck
                        </a>
                    </strong>
                    .{' '}
                </p>
                <ul>
                    <li>
                        Klienten/innen wählen teils bewusst eine/n
                        Therapeuten/in unabhängig vom Standort, da sie ein/e
                        passende/r Therapeut/in dem Standort vorziehen.{' '}
                        <strong>Online-Therapien</strong> sind möglich.
                    </li>
                </ul>
                <p>
                    <strong>Tipp:</strong> Wichtig ist, dass du{' '}
                    <strong>transparent</strong> die Vor- und Nachteile
                    darlegst. Denk daran, dass sich gewisse Menschen auch aus
                    Unsicherheit online an eine Therapie annähern möchten.{' '}
                </p>
                <ul>
                    <li>
                        Klienten/innen kennen oft den Unterschied zwischen{' '}
                        <strong>
                            Psychiater/innen, Psychotherapeuten/innen und/oder
                            Psychologen
                        </strong>{' '}
                        nicht. Der Wunsch nach Psychiater/innen findet darum
                        nicht immer im vollen Bewusstsein statt.
                    </li>
                </ul>
                <p>
                    <strong>Tipp:</strong> Es herrscht teils das Vorurteil, dass
                    Psychiater/innen besser ausgebildet sind und der/die
                    Klient/in möchte einfach sicherstellen, dass er/sie fachlich
                    kompetent therapiert wird. Dieses Missverständnis gilt es
                    einfach und empathisch zu korrigieren und nicht als Angriff
                    zu verstehen. Teile ansonsten:{' '}
                    <strong>Unterschiede zwischen den Berufsgruppen.</strong>
                </p>
            </Text>

            <Divider spacing="xs" invisible />

            <Text>
                Aufgrund der Gewichtung kann es sein, dass ein/eine
                Therapeut/in, die nicht in deiner Region arbeitet trotzdem
                zuerst angezeigt wird. Vielleicht, weil die Expertise mit deinem
                Bedürfnis zusammen passt oder/und weil eine Online-Therapie
                möglich ist.
            </Text>
        </>
    );
}
