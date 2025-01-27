import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'fs/promises';

class TextLoader {
    constructor() {
        this._texts = null;
    }

    // Метод для загрузки текстов из файла
    async loadTexts() {
        try {
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = path.dirname(__filename);
            const filePath = path.resolve(__dirname, '../locales/uk.json');
            const fileContent = await fs.readFile(filePath, 'utf-8');
            this._texts = JSON.parse(fileContent);
        } catch (error) {
            console.error('Error loading texts:', error);
            throw error;
        }
    }

    // Геттер для получения текстов
    get texts() {
        if (!this._texts) {
            throw new Error('Texts have not been loaded. Call loadTexts() first.');
        }
        return this._texts;
    }
}

const textLoader = new TextLoader();

export default textLoader;
