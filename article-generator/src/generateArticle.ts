import axios from 'axios';
import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface Author {
    id: number;
        name: string;
        categories: Category[]

}

interface Category {
    name: string;
    slug: string;
    id: number;
}

async function getAuthors():Promise<Author[]> {
    const res = await axios.get('https://mintence.com/strapi/api/authors?populate[0]=categories');
    return res.data.data;
}

async function getCategories():Promise<Category[]> {
    const res = await axios.get('https://mintence.com/strapi/api/categories');
    return res.data.data;
}

async function listAvailableModels() {
    try {
        const response = await axios.get('https://api.openai.com/v1/models', {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
        });

        const models = response.data.data;
        const modelIds = models.map((model: any) => model.id).sort();

        console.log('✅ Models available to you:\n');
        modelIds.forEach((id: string) => console.log(id));
    } catch (error: any) {
        console.error('❌ Error fetching models:', error.response?.data || error.message);
    }
}

function selectAuthorByCategory(authors: Author[], categoryName: string): number | null {
    for (const author of authors) {
        const categories = author.categories;
        if (categories?.length && categories.some(cat => cat.name.toLowerCase() === categoryName.toLowerCase())) {
            return author.id;
        }
    }
    return null;
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
}

/**
 * Поиск изображения по ключевому слову с использованием Pexels API
 * @param query Строка запроса (например: "gadgets")
 * @returns Прямая ссылка на изображение или пустая строка
 */
export async function searchImagePexels(query: string): Promise<string> {
    try {
        const response = await axios.get(process.env.PEXELS_API_URL!, {
            headers: {
                Authorization: process.env.PEXELS_API_KEY || '',
            },
            params: {
                query: query,
                per_page: 1,
                orientation: 'landscape'
            }
        });

        const photos = response.data.photos;
        if (photos.length > 0) {
            return photos[0].src.original; // или medium/large для меньшего размера
        } else {
            console.warn('Изображения не найдены.');
            return '';
        }
    } catch (error) {
        console.error('Ошибка при поиске изображения:', error);
        return '';
    }
}


async function generateArticle(categoryName: string) {
    const categories = await getCategories();
    const authors = await getAuthors();

    const matchedCategory = categories.find((cat: any) => cat.name.toLowerCase() === categoryName.toLowerCase());
    if (!matchedCategory) {
        throw new Error(`Category "${categoryName}" not found`);
    }

    const categoryId = matchedCategory.id;

    const suitableAuthor = authors.find((author: any) =>
        author.categories.some((c: any) => c.id === categoryId)
    );

    if (!suitableAuthor) {
        throw new Error(`No author found for category "${categoryName}"`);
    }

    const authorId = suitableAuthor.id;

    const systemPrompt = `You are an experienced tech journalist writing articles for an IT/crypto/business news platform.`;

    const userPrompt = `
Write a complete article on a trending topic within the "${categoryName}" category in 2025.
I need a lot of articles and the main topic of the article should not be repeated.
The "text" field must be written in Markdown syntax (e.g. use **bold**, _italic_, \`code\`, # headings, lists, etc).

Return your response ONLY as valid JSON code block:
{
  "title": "...",
  "description": "...",
  "slug": "...",
  "text": "...", ← this must be in Markdown
  "seo": {
    "metaTitle": "...",
    "metaDescription": "..."
  }
}
Do not include any explanation or extra text.
Do not include images or links. The article must be original, engaging, and relevant to 2025 events or trends.
`;

    const response = await axios.post(
        process.env.OPENAI_URL!,
        {
            model: 'gpt-4-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.8
        },
        {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        }
    );

    function extractJSONFromCodeBlock(content: string): any {
        const match = content.match(/```json\s*([\s\S]+?)```/);
        if (!match) throw new Error('No JSON block found');
        return JSON.parse(match[1]);
    }

    const result = response.data.choices[0].message.content;
    const parsed = extractJSONFromCodeBlock(result);
    const imageUrl = await searchImagePexels(parsed.title);

    return {
        slug: parsed.slug || generateSlug(parsed.title),
        description: parsed.description,
        text: parsed.text,
        author: authorId,
        category: categoryId,
        title: parsed.title,
        seo: parsed.seo,
        imageUrl
    };
}

async function uploadToBlog(data:any) {
    // const url = 'https://mintence.com/api/articles'
    const url = 'http://localhost:3000/api/articles'
    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error: any) {
        console.error('❌ POST error:', error.message);
        console.error('❌ article:', data);
        return {
            success: false,
            message: error.message,
        };
    }
}

// // Пример использования
// (async () => {
//     const article = await generateArticle('💰 Cryptocurrency');
//     await uploadToBlog(JSON.stringify({ data: article }));
//
//     // const img = await searchImagePexels('gadgets');
//     // console.log(JSON.stringify(img, null, 2));
// })();

// listAvailableModels();

async function fetchRepeatedly(count = 10) {
    // Асинхронный цикл, который делает один и тот же запрос несколько раз
    for (let i = 0; i < count; i++) {
        try {
            const article = await generateArticle('💰 Cryptocurrency');
            const update = await uploadToBlog({ data: article });
            if (!update?.image) {
                throw new Error(`Ошибка`);
            }
            console.log(`Запрос ${i + 1}`);
        } catch (error) {
            console.error(`Ошибка при запросе ${i + 1}`);
            console.log('error', error);
        }
    }
}


(async () => {
    await fetchRepeatedly();
})();
