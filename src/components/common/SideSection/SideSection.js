import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import './_SideSection.scss';

SideSection.defaultProps = {
    direction: undefined, // left or right
    bgContent: true,
    titleSize: 'l',
};

export default function SideSection(props) {
    let mod_class = [
        'SideSection',
        props.direction !== undefined ? 'direction-' + props.direction : '',
        props.bgContent ? 'has-bgContent' : '',
        props.softBgContent ? 'has-softBgContent' : '',
        props.extendedVisual ? 'has-extendedVisual' : '',
    ];
    mod_class = mod_class.join(' ');

    return (
        <div className={mod_class}>
            <div className="SideSection--column SideSection--visual">
                <div className="SideSection--item">{props.visual}</div>
            </div>
            <div className="SideSection--column SideSection--content">
                <div className="SideSection--item">
                    {props.subtitle && props.subtitle}
                    <Title tag="h4" size={props.titleSize}>
                        {props.title}
                    </Title>
                    {/* <Divider spacing="s" /> */}
                    <Text tag="div">{props.text}</Text>

                    {props.link && (
                        <Section spacingTop="xxs">{props.link}</Section>
                    )}
                </div>
            </div>
        </div>
    );
}
