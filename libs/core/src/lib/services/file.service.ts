import { Injectable } from '@angular/core';

export enum FileType {
  Text = 'text/*',
  JSON = 'application/json',
  Binary = 'application/octet-stream',
  PDF = 'application/pdf',
  Image = 'image/*',
  All = '*',
}

export enum ReadType {
  Text = 'Text',
  ArrayBuffer = 'ArrayBuffer',
  BinaryString = 'BinaryString',
  DataUrl = 'DataUrl',
}

export interface UploadConfiguration {
  readAs: ReadType;
  mimeTypes?: string[] | FileType[];
  multiple?: boolean;
  maxSizeInKB?: number;
}

@Injectable({
  providedIn: 'root',
})
export class FileService {
  upload(
    config: UploadConfiguration = {
      multiple: false,
      maxSizeInKB: 8096,
      readAs: ReadType.Text,
    }
  ) {
    function readFile(file: File) {
      return new Promise(function (resolve, reject) {
        const fr = new FileReader();

        fr.onload = function () {
          resolve(fr.result);
        };

        fr.onerror = function () {
          reject(fr);
        };

        switch (config?.readAs) {
          case ReadType.ArrayBuffer: {
            fr.readAsArrayBuffer(file);
            return;
          }
          case ReadType.BinaryString: {
            fr.readAsBinaryString(file);
            return;
          }
          case ReadType.DataUrl: {
            fr.readAsDataURL(file);
            return;
          }
          default:
          case ReadType.Text: {
            fr.readAsText(file);
            return;
          }
        }
      });
    }

    const downloadAnchorNode = document.createElement('input');
    downloadAnchorNode.setAttribute('type', 'file');

    if (config?.multiple) {
      downloadAnchorNode.setAttribute('multiple', 'true');
    }
    if (config?.mimeTypes) {
      downloadAnchorNode.setAttribute('accept', config?.mimeTypes.join(','));
    }

    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    return new Promise<string | string[] | ArrayBuffer>((resolve, reject) => {
      downloadAnchorNode.addEventListener(
        'change',
        (ev: Event) => {
          const files: FileList = (ev.currentTarget as HTMLInputElement).files;
          const readers = [];

          // Abort if there were no files selected
          if (!files.length) {
            reject('No files uploaded');
            return;
          }

          if (config?.maxSizeInKB) {
            for (let i = 0; i < files.length; i++) {
              if (files[i].size / 1024 > config?.maxSizeInKB) {
                reject(
                  `File exceeds max limit of ${
                    config?.maxSizeInKB
                  } kB, actual size is ${files[i].size / 1024} kB!`
                );
                return;
              }
            }
          }

          for (let i = 0; i < files.length; i++) {
            readers.push(readFile(files[i]));
          }

          Promise.all(readers).then((values) => {
            resolve(values?.length === 1 ? values?.shift() : values);
          });
        },
        false
      );
    });
  }

  exportJSONObject(exportObj: Record<string, any>, exportName: string) {
    const jsonContent = JSON.stringify(exportObj, null, 2);
    this.exportFile(jsonContent, 'text/json', exportName + '.json');
  }

  exportJSON(contentBase64: string, exportName: string) {
    const jsonContent = atob(contentBase64);
    this.exportFile(jsonContent, 'text/json', exportName + '.json');
  }

  exportCSV(contentBase64: string, exportName: string) {
    const csvContent: string = atob(contentBase64);
    this.exportFile(csvContent, 'text/csv', exportName + '.csv');
  }

  exportPDF(contentBase64: string, exportName: string) {
    const byteString: string = atob(contentBase64);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    this.exportFile(int8Array, 'application/pdf', exportName + '.pdf');
  }

  exportFile(data: any, mimeType: string, fileName: string) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(
      new Blob([data], {
        type: mimeType,
      })
    );
    a.setAttribute('download', fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
