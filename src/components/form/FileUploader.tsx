import Item from 'atoms/Item';
import { useFile } from 'hooks/useFile';
import React, { useRef } from 'react';
import { CgChevronRight } from 'react-icons/cg';
import './FileUploader.scss';

interface Props {
    acceptedFileTypes: string[];
    onSubmit: (file?: any, name?: string) => Promise<any>;
    icon: React.ReactNode;
    name: string;
    title: string;
    maxSize?: number;
}

const FileUploader: React.FC<Props> = ({
    acceptedFileTypes,
    onSubmit,
    icon,
    name,
    title,
    maxSize = 30000000,
}) => {
    const inputRef = useRef<any>();

    const { resolveFile, uploadFailed } = useFile();

    const handleUploadFile = (e: any) => {
        try {
            const {
                target: { files },
            } = e;
            if (files && files.length) {
                const [file] = files;
                inputRef.current.value = '';
                resolveFile({
                    acceptedFileTypes,
                    maxSize,
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    onSubmit: () => onSubmit(file, file.name),
                });
            }
        } catch {
            uploadFailed();
            onSubmit();
        }
    };

    return (
        <label htmlFor={name} className="FileUploader--label">
            <Item
                className="clickable"
                title={title}
                startSlot={icon}
                endSlot={
                    <span className="Item--arrowIcon">
                        <CgChevronRight />
                    </span>
                }
            >
                <input
                    className="FileUploader--input"
                    ref={inputRef}
                    id={name}
                    type="file"
                    accept={acceptedFileTypes.join(',')}
                    alt="Aepsy-upload-image"
                    onChange={handleUploadFile}
                />
            </Item>
        </label>
    );
};

export default FileUploader;
