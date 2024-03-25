import { Browser } from '@capacitor/browser';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { File } from '@ionic-native/file';
import { HTTP } from '@ionic-native/http';
import { usePlatform, useToast, useTranslationWithContext } from 'hooks';
import useAlert from 'hooks/useAlert';
import { useCallback, useEffect, useState } from 'react';
import { downloadURI } from 'util/fileHelpers';

const DOWNLOAD_STATE = {
    NotDownloaded: 'NotDownloaded',
    Downloading: 'Downloading',
    Downloaded: 'Downloaded',
};

const AEPSY_DIRECTORY = 'Aepsy';

const useDownloadFile = ({
    name,
    onDownloaded,
}: {
    name?: string;
    onDownloaded?: VoidFunction;
}) => {
    const { isNativeApp, isIos, isAndroid } = usePlatform();
    const { presentAlert } = useAlert();
    const { showToast } = useToast();
    const { translate } = useTranslationWithContext();
    const [downloadState, setDownloadState] = useState(
        DOWNLOAD_STATE.NotDownloaded
    );

    const fileSystemPath = isIos
        ? File.documentsDirectory
        : File.externalDataDirectory;

    const directoryPath = fileSystemPath + AEPSY_DIRECTORY + '/';

    const handleCanNotReadFile = () => {
        onDownloaded && onDownloaded();
        showToast({
            message: translate('download.can.not.read.file'),
            position: 'bottom',
        });
    };

    const viewFile = async (
        fileName: string,
        filePath: string,
        url: string
    ) => {
        if (isIos) {
            DocumentViewer.viewDocument(
                filePath,
                'application/pdf',
                {
                    title: fileName,
                },
                () => {},
                () => {},
                handleCanNotReadFile,
                handleCanNotReadFile
            );
        }
        if (isAndroid) {
            await Browser.open({ url });
        }
    };

    const downloadFile = async (
        url: string,
        fileName: string,
        filePath: string
    ) => {
        try {
            await HTTP.downloadFile(url, {}, {}, filePath);
            onDownloaded && onDownloaded();
            setDownloadState(DOWNLOAD_STATE.Downloaded);
            await viewFile(fileName, filePath, url);
            showToast({
                message: translate('download.success'),
                position: 'bottom',
                color: 'success',
            });
        } catch {
            handleCanNotReadFile();
        }
    };

    const nativeDownload = async (url: string, fileName: string) => {
        const filePath = directoryPath + fileName;
        if (downloadState === DOWNLOAD_STATE.Downloaded) {
            await viewFile(fileName, filePath, url);
            onDownloaded && onDownloaded();
        } else {
            presentAlert(
                translate('download.confirm.title'),
                undefined,
                async () => {
                    try {
                        setDownloadState(DOWNLOAD_STATE.Downloading);
                        File.checkDir(fileSystemPath, AEPSY_DIRECTORY)
                            .then(() => {
                                downloadFile(url, fileName, filePath);
                            })
                            .catch(() => {
                                File.createDir(
                                    fileSystemPath,
                                    AEPSY_DIRECTORY,
                                    true
                                ).then(() => {
                                    downloadFile(url, fileName, filePath);
                                });
                            });
                    } catch (e: any) {
                        showToast({
                            message: translate('download.error'),
                            position: 'bottom',
                            color: 'primary',
                        });
                        setDownloadState(DOWNLOAD_STATE.NotDownloaded);
                        onDownloaded && onDownloaded();
                    }
                },
                async () => {
                    onDownloaded && onDownloaded();
                }
            );
        }
    };

    const onDownloadFile = useCallback(
        (e: any, url: string, fileName: string) => {
            if (isNativeApp) {
                nativeDownload(url, fileName);
            } else {
                downloadURI(e, url, fileName).then(() => {
                    onDownloaded && onDownloaded();
                });
            }
        },
        [downloadState]
    );

    const checkDownloadState = useCallback(async (fileName: string) => {
        const fileChecked = await File.checkFile(directoryPath, fileName);
        if (fileChecked) {
            setDownloadState(DOWNLOAD_STATE.Downloaded);
        }
    }, []);

    useEffect(() => {
        if (isNativeApp && name) {
            checkDownloadState(name);
        }
    }, [isNativeApp, checkDownloadState, name]);

    return { downloadState, onDownloadFile };
};

export default useDownloadFile;
