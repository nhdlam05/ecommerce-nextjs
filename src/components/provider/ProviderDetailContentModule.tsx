import Module from 'atoms/Module/Module';
import ModuleGroup from 'atoms/ModuleGroup';
import Section from 'atoms/Section/Section';
import { Optional } from 'model/common';
import React from 'react';

interface Props {
    anchorId?: string;
    title?: Optional<string>;
    children: React.ReactNode;
    variant?: 'modal' | null;
}

const ProviderDetailContentModule: React.FC<Props> = ({
    anchorId,
    title,
    children,
    variant,
}) => {
    return (
        <div className="ProviderDetailContentModule" id={anchorId}>
            <Section spacingTop="xxs" spacingBottom="m">
                <ModuleGroup title={title || undefined}>
                    <Module
                        padding={variant === 'modal' ? 's' : 'm'}
                        variant={variant}
                    >
                        {children}
                    </Module>
                </ModuleGroup>
            </Section>
        </div>
    );
};

export default ProviderDetailContentModule;
