import { generateBookCover } from '../components/api/Openapi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import TextArea from '../components/TextArea';
import { GENRE_LIST, TAG_LIST } from "../bookOption";

function BookRegister() {
  const navigate = useNavigate();
  const bookUrl = 'http://localhost:3000/books';

  const [form, setForm] = useState({
    title: '',
    author: '',
    genre: '',
    likes: 0,
    content: '',
    tag: '',
    coverImageUrl: '',
  });

  const [selectedTags, setSelectedTags] = useState([]);
  const [errors, setErrors] = useState({});
  const [apiKey, setApiKey] = useState('');
  const [quality, setQuality] = useState('auto');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenreSelect = (genre) => {
    setForm((prev) => ({ ...prev, genre: prev.genre === genre ? '' : genre }));
  };

  const handleTagSelect = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleGenerateCover = async () => {
    if (!form.title.trim() || !form.author.trim() || !form.genre) {
      alert('AI 표지를 생성하려면 도서 제목, 저자명, 장르를 먼저 입력/선택해주세요.');
      return;
    }
    if (!apiKey.trim()) {
      alert('OpenAI API Key를 입력해주세요.');
      return;
    }
    if (!window.confirm('AI 표지 생성 시 OpenAI API 비용이 발생합니다. 계속하시겠습니까?')) {
      alert('표지 생성이 취소되었습니다.');
      return;
    }
    setLoading(true);
    try {
      const registerBook = {
        title: form.title,
        author: form.author,
        content: form.content,
        tag: selectedTags.join(','),
        genre: form.genre,
      };
      const imageSrc = await generateBookCover(registerBook, apiKey, quality);
      setForm((prev) => ({ ...prev, coverImageUrl: imageSrc }));
      alert(`"${form.title}" 표지가 생성되었습니다! 하단의 등록하기 버튼을 눌러야 최종 저장됩니다.`);
    } catch (err) {
      if (err.message === '401')              alert('API Key가 올바르지 않습니다.');
      else if (err.message === '429')         alert('요청 한도 초과. 잠시 후 다시 시도해주세요.');
      else if (err.message === 'PARSE_ERROR') alert('응답 형식 오류가 발생했습니다.');
      else                                    alert(`오류: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = '도서 제목을 입력해주세요.';
    if (!form.author.trim()) newErrors.author = '저자 이름을 입력해주세요.';
    if (!form.genre) newErrors.genre = '장르를 선택해주세요.';
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    const newBook = {
      ...form,
      tag: selectedTags.join(','),
      likes: Number(form.likes),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      const res = await fetch(bookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook),
      });
      if (!res.ok) throw new Error('서버 응답 오류');
      alert('도서가 등록되었습니다!');
      navigate('/books');
    } catch (error) {
      console.error('도서 등록 중 에러 발생:', error);
      alert('등록 실패! json-server 실행 확인 및 네트워크 상태를 확인해주세요.');
    }
  };

  return (
    <div className="book-register">
      <h2 className="book-register__title">새 도서 등록하기</h2>

      {form.coverImageUrl && (
        <div className="book-register__preview">
          <p className="book-register__preview-label">생성된 표지 미리보기</p>
          <img src={form.coverImageUrl} alt="표지 미리보기" className="book-register__preview-img" />
        </div>
      )}

      <div className="book-register__group">
        <label className="book-register__label">
          도서 제목 <span className="book-register__required">*</span>
        </label>
        <Input
          name="title"
          placeholder="도서 제목을 입력하세요"
          value={form.title}
          onChange={(e) => { handleChange(e); setErrors((prev) => ({ ...prev, title: '' })); }}
          className={`book-register__input${errors.title ? ' book-register__input--error' : ''}`}
        />
        {errors.title && <p className="book-register__error-msg">{errors.title}</p>}
      </div>

      <div className="book-register__group">
        <label className="book-register__label">
          저자명 <span className="book-register__required">*</span>
        </label>
        <Input
          name="author"
          placeholder="저자 이름을 입력하세요"
          value={form.author}
          onChange={(e) => { handleChange(e); setErrors((prev) => ({ ...prev, author: '' })); }}
          className={`book-register__input${errors.author ? ' book-register__input--error' : ''}`}
        />
        {errors.author && <p className="book-register__error-msg">{errors.author}</p>}
      </div>

      <div className="book-register__group">
        <p className="book-register__label">
          장르 선택 <span className="book-register__required">*</span>
        </p>
        <div className={`book-register__chips${errors.genre ? ' book-register__chips--error' : ''}`}>
          {GENRE_LIST.map((g) => (
            <span
              key={g}
              onClick={() => { handleGenreSelect(g); setErrors((prev) => ({ ...prev, genre: '' })); }}
              className={`book-register__chip${form.genre === g ? ' book-register__chip--active' : ''}`}
            >
              {g}
            </span>
          ))}
        </div>
        {errors.genre && <p className="book-register__error-msg">{errors.genre}</p>}
      </div>

      <div className="book-register__group">
        <p className="book-register__label">태그 선택 (복수 선택 가능)</p>
        <div className="book-register__chips">
          {TAG_LIST.map((t) => (
            <span
              key={t}
              onClick={() => handleTagSelect(t)}
              className={`book-register__chip${selectedTags.includes(t) ? ' book-register__chip--active' : ''}`}
            >
              {t} {selectedTags.includes(t) && '×'}
            </span>
          ))}
        </div>
      </div>

      <div className="book-register__group">
        <label className="book-register__label">도서 소개 / 내용</label>
        <TextArea
          name="content"
          placeholder="도서의 주요 내용이나 첫 문장을 입력해 주세요."
          value={form.content}
          onChange={handleChange}
          rows={5}
          className="book-register__textarea"
        />
      </div>

      <div className="book-register__group">
        <label className="book-register__label">API Key</label>
        <Input
          type="password"
          placeholder="sk-..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="book-register__input"
        />
      </div>

      <div className="book-register__ai-section">
        <h3 className="book-register__ai-title">🎨 AI 표지 생성</h3>

        <div className="book-register__group">
          <label className="book-register__label">품질</label>
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            disabled={loading}
            className="book-register__select"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        <Button
          label={loading ? '⏳ 표지 그리는 중...' : '🎨 AI 표지 생성'}
          onClick={handleGenerateCover}
          disabled={loading}
          className="book-register__ai-btn"
        />
      </div>

      <Button
        label="등록하기"
        onClick={handleSubmit}
        className="book-register__submit"
      />
    </div>
  );
}

export default BookRegister;
