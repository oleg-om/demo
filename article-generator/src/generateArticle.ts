import axios from "axios";
import inquirer from "inquirer";
import * as dotenv from "dotenv";

dotenv.config();

interface Author {
  id: number;
  name: string;
  categories: Category[];
}

interface Category {
  name: string;
  slug: string;
  id: number;
}

async function getAuthors(): Promise<Author[]> {
  const res = await axios.get(
    "https://mintence.com/strapi/api/authors?populate[0]=categories",
  );
  return res.data.data;
}

async function getCategories(): Promise<Category[]> {
  const res = await axios.get("https://mintence.com/strapi/api/categories");
  return res.data.data;
}

async function listAvailableModels() {
  try {
    const response = await axios.get("https://api.openai.com/v1/models", {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    });

    const models = response.data.data;
    const modelIds = models.map((model: any) => model.id).sort();

    console.log("✅ Models available to you:\n");
    modelIds.forEach((id: string) => console.log(id));
  } catch (error: any) {
    console.error(
      "❌ Error fetching models:",
      error.response?.data || error.message,
    );
  }
}

function selectAuthorByCategory(
  authors: Author[],
  categoryName: string,
): number | null {
  for (const author of authors) {
    const categories = author.categories;
    if (
      categories?.length &&
      categories.some(
        (cat) => cat.name.toLowerCase() === categoryName.toLowerCase(),
      )
    ) {
      return author.id;
    }
  }
  return null;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
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
        Authorization: process.env.PEXELS_API_KEY || "",
      },
      params: {
        query: query,
        per_page: 1,
        orientation: "landscape",
      },
    });

    const photos = response.data.photos;
    if (photos.length > 0) {
      return photos[0].src.original; // или medium/large для меньшего размера
    } else {
      console.warn("❌ Изображения не найдены.");
      return "";
    }
  } catch (error) {
    console.error("❌ Ошибка при поиске изображения:", error);
    return "";
  }
}

async function generateArticle(categoryName: string) {
  const categories = await getCategories();
  const authors = await getAuthors();

  const matchedCategory = categories.find(
    (cat: any) => cat.name.toLowerCase() === categoryName.toLowerCase(),
  );
  if (!matchedCategory) {
    throw new Error(`Category "${categoryName}" not found`);
  }

  const categoryId = matchedCategory.id;

  const suitableAuthors = authors.filter((author: any) =>
    author.categories.some((c: any) => c.id === categoryId),
  );

  // Если подходящие авторы найдены, выбираем случайного
  const randomAuthor =
    suitableAuthors.length > 0
      ? suitableAuthors[Math.floor(Math.random() * suitableAuthors.length)]
      : null; // Если подходящих авторов нет, возвращаем null

  if (!randomAuthor) {
    throw new Error(`❌ No author found for category "${categoryName}"`);
  }

  const authorId = randomAuthor.id;

  const systemPrompt = `You are an experienced tech journalist writing articles for an IT/crypto/business news platform.`;

  const userPrompt = `
Write a complete, SEO-optimized article on a trending topic within the "\${categoryName}" category for 2025. 
The article must focus on a "how to..." theme, such as "How to [achieve something]", "How to build", "How to optimize", or similar topics that attract search traffic. 
The content should be original, relevant to 2025 trends, and designed to rank well in search engines.

Ensure the article is structured in **valid Markdown format**, including:
- **Headings** (use \`##\`, \`###\` for different levels). Do not use h1 title and do not start article text with any titles because title already exists.
- **Bold** and _italic_ text
- Ordered and unordered **lists**
- Inline \`code\` or code blocks where relevant
- Clear, concise explanations with practical examples and step-by-step guides

⚠️ The output of text field must be valid Markdown that can be rendered correctly by parsers like \`react-markdown\`.

Return your response ONLY as a valid JSON code block:
\`\`\`json
{
  "title": "...",
  "description": "...",
  "slug": "...",
  "text": "...",
  "seo": {
    "metaTitle": "...",
    "metaDescription": "..."
  }
}
\`\`\`

Do not include any explanations or extra text. Do not include images or links. The article must be 100% original, engaging, and relevant to 2025 events or trends. It should be easy to read and contain well-researched, actionable steps that can rank high in search engines.
`;

  const response = await axios.post(
    process.env.OPENAI_URL!,
    {
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  function extractJSONFromCodeBlock(content: string): any {
    const match = content.match(/```json\s*([\s\S]+?)```/);
    if (!match) throw new Error("No JSON block found");
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
    imageUrl,
  };
}

async function uploadToBlog(data: any, url: string) {
  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("❌ POST error:", error.message);
    console.error("❌ article:", data);
    return {
      success: false,
      message: error.message,
    };
  }
}
type FetchProps = {
  count?: number;
  category: string;
  url: string;
};
async function fetchRepeatedly({ count = 10, category, url }: FetchProps) {
  // Асинхронный цикл, который делает один и тот же запрос несколько раз
  for (let i = 0; i < count; i++) {
    try {
      const article = await generateArticle(category);
      const update = await uploadToBlog({ data: JSON.stringify(article) }, url);
      if (!update?.image) {
        throw new Error(`Ошибка`);
      }
      console.log(`✅ Запрос ${i + 1} - выполнен`);
    } catch (error) {
      console.error(`Ошибка при запросе ${i + 1}`);
      console.log("error", error);
    }
  }
}

async function main() {
  const categories = await getCategories();

  const answer = await inquirer.prompt([
    {
      type: "list", // Тип вопроса — список с вариантами
      name: "category", // Имя переменной, в которую будет записан ответ
      message: "Какая категория?", // Текст вопроса
      choices: categories.map((c) => c.name), // Варианты ответа
    },
    {
      type: "list",
      name: "url",
      message: "Какой url?",
      choices: [
        "http://localhost:3000/api/articles",
        "https://mintence.com/api/articles",
      ],
    },
    {
      type: "list",
      name: "count",
      message: "Какой цикл?",
      choices: ["1", "10", "20"],
    },
  ]);

  await fetchRepeatedly({
    category: answer.category,
    url: answer.url,
    count: Number(answer.count),
  });
}
main();
