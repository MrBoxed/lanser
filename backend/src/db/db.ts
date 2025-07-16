import 'dotenv/config';

import { drizzle } from 'drizzle-orm/libsql';
import { eq } from 'drizzle-orm';

import { movieTable, usersTable, booksTable, musicTable, filesTable } from './schema';
import { FileSchema } from '../config/types';
import { File } from 'buffer';

const db = drizzle(process.env.DB_FILE_NAME!);


type FormDataType = {
    filename: string,
    category: string,
    filetype: string,
}

export async function InsertIntoTable(uploadedFile: Express.Multer.File, formData: FormDataType) {

    // TODO: 
    // :: Identify the table Type::
    // :: Put it in general filesTables 

    // :: FIND who uploaded this file ::
    // type of data to enter in which table we got
    // const fileData: FileSchema = {
    //     fileName: formData.filename,
    //     category: formData.category,
    //     fileType: uploadedFile.mimetype,

    // }

}