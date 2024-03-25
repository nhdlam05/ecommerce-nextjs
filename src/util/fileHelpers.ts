export function downloadURI(
    e: any,
    url: string,
    filename: string
): Promise<any> {
    e.preventDefault();

    return new Promise((resolve, reject) => {
        fetch(url)
            .then((response) => response.blob())
            .then((blob) => {
                const blobURL = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobURL;
                a.style.display = 'none';

                if (filename && filename.length) a.download = filename;
                document.body.appendChild(a);
                a.click();
                resolve(true);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

export function truncateFileName(fileName: string) {
    if (fileName.length < 25) return fileName;
    return (
        fileName.substring(0, 20) +
        '...' +
        fileName.substring(fileName.length - 5, fileName.length)
    );
}
