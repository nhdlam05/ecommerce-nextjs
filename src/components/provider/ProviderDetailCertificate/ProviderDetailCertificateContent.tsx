import IconText from 'atoms/IconText/IconText';
import Text from 'atoms/Text/Text';
import { CertificateItem } from 'generated/graphql';
import React from 'react';
import { BiCheckShield } from 'react-icons/bi';

interface Props {
    items: CertificateItem[];
    showIcon?: boolean;
}

const ProviderDetailCertificateContent: React.FC<Props> = ({
    items,
    showIcon = true,
}) => {
    return (
        <>
            {items.map((element: CertificateItem, index: number) => {
                return showIcon ? (
                    <IconText
                        key={index}
                        icon={<BiCheckShield />}
                        text={
                            <Text size="s" theme="dark">
                                {element.label}
                            </Text>
                        }
                    ></IconText>
                ) : (
                    <Text size="s" theme="dark" tag="span">
                        {element.label} -{' '}
                    </Text>
                );
            })}
        </>
    );
};

export default ProviderDetailCertificateContent;
