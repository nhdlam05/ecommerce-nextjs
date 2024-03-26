import { Chooser } from '@ionic-native/chooser';
import Item from 'atoms/Item';
import { useFile } from 'hooks/useFile';
import React from 'react';
import './FileUploader.scss';

interface Props {
    acceptedFileTypes: string[];
    onSubmit: (file?: any, name?: string) => Promise<any>;
    icon: React.ReactNode;
    title: string;
    maxSize?: number;
}

const NativeFileUploader: React.FC<Props> = ({
    acceptedFileTypes,
    onSubmit,
    icon,
    title,
    maxSize = 5000000,
}) => {
    const { resolveFile, uploadFailed } = useFile();

    const handleUploadFile = () => {
        try {
            Chooser.getFile('application/pdf').then((res: any) => {
                if (res) {
                    const file = new Blob([res.data], { type: res.mediaType });

                    resolveFile({
                        acceptedFileTypes,
                        maxSize,
                        name: res.name,
                        type: file.type,
                        size: file.size,
                        onSubmit: () => onSubmit(file, res.name),
                    });
                }
            });
        } catch {
            uploadFailed();
            onSubmit();
        }
    };

    return (
        <Item
            button
            title={title}
            startSlot={icon}
            onClick={handleUploadFile}
        />
    );
};

export default NativeFileUploader;
