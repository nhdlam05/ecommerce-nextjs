import { useMutation } from '@apollo/client';
import CircularProgress from '@mui/material/CircularProgress';
import Button from 'atoms/Button/Button';
import Icon, {
    IconCheck,
    IconFileAdd,
    IconPrescription,
    IconUpload,
} from 'atoms/Icon';
import Typography from 'atoms/Typography';
import { DragAndDropContainer } from 'components/drag-and-drop';
import { UPLOAD_AUDIO_FILE_FOR_PROVIDER } from 'gql/provider';
import { useFile } from 'hooks/useFile';
import React, { useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Trans } from 'react-i18next';
import {
    LicenseUploaderImageWrapper,
    ProviderProfileLicenseUploaderWrapper,
} from './styles';

interface Props {
    maxSize?: number;
    onDone?: VoidFunction;
    providerId?: string;
    locale: string;
}

const AudioUploader: React.FC<Props> = ({
    onDone,
    maxSize = 5000000,
    providerId,
    locale,
}) => {
    const acceptedFileTypes = ['audio/mpeg', 'audio/mp3'];
    const name = 'ProviderProfileAudioUploader';
    const inputRef = useRef<any>();
    const [isLoading, setIsLoading] = useState(false);
    const [isHover, setIsHover] = useState(false);
    const [isSuccess, setSuccess] = useState(false);
    const { resolveFile, uploadFailed } = useFile();

    const [uploadAudioFileForProvider] = useMutation(
        UPLOAD_AUDIO_FILE_FOR_PROVIDER
    );

    const handleUploadFailed = () => {
        uploadFailed();
        setIsLoading(false);
    };

    const onSubmit = async (file?: any, fileName?: string) => {
        try {
            let res;
            if (providerId) {
                res = await uploadAudioFileForProvider({
                    variables: {
                        input: {
                            locale,
                            fileName,
                            providerId,
                        },
                        file,
                    },
                });
            }
            if (res) {
                setIsLoading(false);
                setSuccess(true);
                onDone && onDone();
            } else {
                handleUploadFailed();
            }
        } catch (error: any) {
            console.log(error?.message);
            handleUploadFailed();
        }
    };

    const handleFiles = (files: any[]) => {
        try {
            setSuccess(false);
            setIsLoading(true);
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
                    onCancel: () => {
                        setIsLoading(false);
                    },
                });
            }
        } catch {
            uploadFailed();
        }
    };

    const onFileDrop = (data: any) => {
        const { files } = data;
        setIsHover(false);
        handleFiles(files);
    };

    const onFileChange = (e: any) => {
        const {
            target: { files },
        } = e;
        handleFiles(files);
    };

    const onDropContainerHover = () => {
        setIsHover(true);
    };

    const getButtonIcon = () => {
        if (isLoading) return <CircularProgress size={15} />;
        if (isHover) return <IconFileAdd />;
        if (isSuccess) return <IconCheck />;

        return <IconUpload />;
    };

    return (
        <>
            <DndProvider backend={HTML5Backend}>
                <DragAndDropContainer
                    onDrop={onFileDrop}
                    onHover={onDropContainerHover}
                >
                    <label htmlFor={name}>
                        <ProviderProfileLicenseUploaderWrapper
                            isHover={isHover}
                        >
                            <input
                                ref={inputRef}
                                id={name}
                                type="file"
                                accept="audio/mp3,audio/*;capture=microphone"
                                alt="Aepsy-upload-audio"
                                onChange={onFileChange}
                                disabled={isLoading}
                            />
                            <LicenseUploaderImageWrapper>
                                <Icon
                                    icon={<IconPrescription />}
                                    size="xl"
                                    align="center"
                                    theme="lighter"
                                />
                                <Button
                                    shape="round"
                                    label={getButtonIcon()}
                                    size="s"
                                    type="button"
                                />
                            </LicenseUploaderImageWrapper>
                            <Typography variant="h5">
                                <Trans i18nKey="document.uploader.title">
                                    <Typography
                                        color="cta.main"
                                        variant="caption"
                                    >
                                        <></>
                                    </Typography>
                                </Trans>
                            </Typography>
                            <Typography variant="subtitle1" text="secondary">
                                (max. 5mb, Format: mp3)
                            </Typography>
                        </ProviderProfileLicenseUploaderWrapper>
                    </label>
                </DragAndDropContainer>
            </DndProvider>
        </>
    );
};

export default AudioUploader;
