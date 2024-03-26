import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
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

const CameraUploader: React.FC<Props> = ({
    acceptedFileTypes,
    onSubmit,
    icon,
    title,
    maxSize = 5000000,
}) => {
    const { resolveFile } = useFile();

    const handleUploadFile = async () => {
        try {
            const imgPath = await Camera.getPicture({
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                targetWidth: 520,
                targetHeight: 680,
                mediaType: 0,
                encodingType: Camera.EncodingType.JPEG,
            });

            const file = await File.resolveLocalFilesystemUrl(imgPath);
            if (!file) return;

            const arrayBuffer = await File.readAsArrayBuffer(
                file.nativeURL.substr(0, file.nativeURL.lastIndexOf('/') + 1),
                file.name
            );

            const imgType = `image/jpeg`;
            const imgBlob = new Blob([arrayBuffer], {
                type: imgType,
            });

            resolveFile({
                acceptedFileTypes,
                maxSize,
                type: imgType,
                size: imgBlob.size,
                name: file.name,
                onSubmit: () => onSubmit(imgBlob, file.name),
            });
        } catch {
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

export default CameraUploader;
