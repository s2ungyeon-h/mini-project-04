const OPENAI_IMAGE_API_URL = 'https://api.openai.com/v1/images/generations';

export async function generateBookCover(book, userApiKey, quality = 'auto') {
  const prompt = `
A high-quality, professional book cover design for a book titled "${book.title}" by ${book.author}.
Genre: ${book.genre}. Tags: ${book.tag}.
Visual concept based on the story: ${book.content}
---
Visual direction:
- Genre-specific mood: ${getGenreMood(book.genre)}
- Composition: cinematic, full-bleed illustration with strong focal point
- Color palette: rich and thematic, matching the genre and emotional tone
- Lighting: dramatic and atmospheric
---
Text layout:
- Title "${book.title}" displayed prominently at the top in elegant, genre-appropriate font
- Author name "${book.author}" at the bottom in smaller clean serif font
- Text should be clearly legible and well-integrated into the design
---
Style: professional publishing quality, award-winning book cover art
  `.trim();

  const res = await fetch(OPENAI_IMAGE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userApiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-image-2',
      prompt,
      n: 1,
      size: '1024x1536',
      quality,
      output_format: 'png',
    }),
  });

  if (res.status === 401) throw new Error('401');
  if (res.status === 429) throw new Error('429');
  if (!res.ok) throw new Error(`FAIL:${res.status}`);

  const data = await res.json();
  const b64Json = data.data?.[0]?.b64_json;
  if (!b64Json) throw new Error('PARSE_ERROR');

  const dataUrl = `data:image/png;base64,${b64Json}`;
  return compressImage(dataUrl, 400, 0.5);
}

// base64 이미지를 canvas로 리사이즈 + JPEG 압축
export function compressImage(dataUrl, maxWidth = 512, quality = 0.8) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement('canvas');
      canvas.width  = img.width  * scale;
      canvas.height = img.height * scale;
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = dataUrl;
  });
}

// 장르별 이미지 생성 무드 설정
function getGenreMood(genre) {
  const moods = {
    '소설':    'literary fiction, emotional depth, human drama, warm and cinematic tones',
    '고전':    'timeless elegance, vintage aesthetic, aged paper texture, classical art style',
    '역사':    'historical epic, aged maps, sepia tones, dramatic lighting, period setting',
    'IT':      'digital technology, circuit patterns, futuristic interface, clean modern design',
    '동화':    'whimsical illustration, soft pastel colors, magical fairy tale world, children friendly',
    '자기계발': 'motivational, bright and energetic, clean minimalist design, uplifting mood',
    '과학':    'scientific discovery, cosmos, molecular structures, clean and precise illustration',
    '경제':    'professional, financial charts, bold typography, sleek corporate design',
    '철학':    'deep and contemplative, abstract symbolism, dark and moody, thought-provoking',
    '예술':    'creative expression, vibrant colors, artistic brushstrokes, gallery-worthy aesthetic',
  };
  return moods[genre] || 'artistic, expressive, visually compelling';
}
