import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { IFile, IFileUploadResponse } from '../types/file.type';


// Configuration
cloudinary.config({
    cloud_name: 'dza9jdqt6',
    api_key: '729964928281866',
    api_secret: '9OAbO9W3tyBN7l3oxHeFJ2otJWE'
});

const uploadCloud = async (file: IFile): Promise<IFileUploadResponse | undefined> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload(
                file.path,
                (error: Error, result: IFileUploadResponse) => {
                    fs.unlinkSync(file.path)
                    if (error) {
                        reject(error)
                    }
                    else {
                        resolve(result)
                    }
                }
            )
    })
}


export default uploadCloud